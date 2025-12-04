import * as THREE from 'three';
import {Camera} from "./components/Camera.js";
import {Renderer} from "./components/Renderer.js";
import {player} from "./components/Player.js";
import {map, initMap, getMapBounds, house} from "./components/Map.js";
import {initMonsters, updateMonsters, monsters, createMonsterAt} from './components/Monsters.js';
import './style.css';
import './collectUserInput.js';
import {animatePlayer} from './animatePlayer.js'
import { getBox } from './colliders.js';

const scene = new THREE.Scene();
scene.add(player);
scene.add(map)

const ambientLight = new THREE.AmbientLight();
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight();
dirLight.position.set(-100, -100, 200);
scene.add(dirLight);

const camera = Camera();
player.add(camera);

await initMap();

// Spawn monsters at map corners
const bounds = getMapBounds();
const spawnCorners = [
    [bounds.minX, bounds.minY],
    [bounds.maxX, bounds.minY],
    [bounds.minX, bounds.maxY],
    [bounds.maxX, bounds.maxY],
];
for (const m of initMonsters(bounds)) scene.add(m);

const renderer = Renderer();
renderer.setAnimationLoop(animate);

const clock = new THREE.Clock();

// --- Simple score UI (top-left) ---
const killsEl = document.createElement('div');
killsEl.style.position = 'fixed';
killsEl.style.top = '8px';
killsEl.style.left = '8px';
killsEl.style.padding = '4px 8px';
killsEl.style.background = 'rgba(0,0,0,0.4)';
killsEl.style.color = '#fff';
killsEl.style.fontFamily = 'monospace';
killsEl.style.fontSize = '14px';
killsEl.style.borderRadius = '4px';
document.body.appendChild(killsEl);
let kills = 0;
function updateKillsUI() { killsEl.textContent = `Score: ${kills}`; }
updateKillsUI();

// --- Radial attack on click ---
// Increase attack radius noticeably (~1.75x previous 32)
const ATTACK_RADIUS = 56;
function handleClickAttack() {
    const px = player.position.x;
    const py = player.position.y;
    const r = ATTACK_RADIUS;

    // Determine which monsters are within radius
    const survivors = [];
    let killedThisClick = 0;
    for (const m of monsters) {
        const dx = m.position.x - px;
        const dy = m.position.y - py;
        // Compute a conservative 2D radius from monster's bounding box in XY
        const mBox = getBox(m);
        const mRadius = 0.5 * Math.max(
            mBox.max.x - mBox.min.x,
            mBox.max.y - mBox.min.y
        );
        const touchR = r + mRadius;
        if (dx*dx + dy*dy <= touchR * touchR) {
            // remove from scene
            scene.remove(m);
            killedThisClick++;
        } else {
            survivors.push(m);
        }
    }

    if (killedThisClick > 0) {
        // Mutate the exported array in place to keep reference stable
        monsters.splice(0, monsters.length, ...survivors);
        kills += killedThisClick;
        updateKillsUI();
    }

    // Visualize attack radius briefly
    spawnAttackEffect();
}

// Attach to canvas or window
const canvas = document.querySelector('canvas.game');
if (canvas) {
    canvas.addEventListener('click', handleClickAttack);
} else {
    window.addEventListener('click', handleClickAttack);
}

// --- Attack radius visual effect management ---
const attackEffects = [];
function spawnAttackEffect() {
    // Flat disk aligned with ground plane (XY), slightly above to avoid z-fighting
    const geom = new THREE.CircleGeometry(ATTACK_RADIUS, 48);
    const mat = new THREE.MeshBasicMaterial({ color: 0xffff00, transparent: true, opacity: 0.6, side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(geom, mat);
    // No rotation needed: ground is XY plane at z=0
    mesh.position.set(player.position.x, player.position.y, 0.2);
    scene.add(mesh);
    attackEffects.push({ mesh, mat, ttl: 0.5 }); // seconds
}

function updateAttackEffects(dt) {
    for (let i = attackEffects.length - 1; i >= 0; i--) {
        const e = attackEffects[i];
        e.ttl -= dt;
        const t = Math.max(e.ttl, 0);
        e.mat.opacity = 0.6 * (t / 0.5);
        if (e.ttl <= 0) {
            scene.remove(e.mesh);
            e.mesh.geometry.dispose();
            e.mat.dispose();
            attackEffects.splice(i, 1);
        }
    }
}

// --- Periodic spawning ---
let spawnTimer = null;
function startSpawning() {
    stopSpawning();
    spawnTimer = setInterval(() => {
        const [x, y] = spawnCorners[(Math.random() * spawnCorners.length) | 0];
        const m = createMonsterAt(x, y);
        monsters.push(m);
        scene.add(m);
    }, 7000);
}
function stopSpawning() {
    if (spawnTimer) { clearInterval(spawnTimer); spawnTimer = null; }
}
startSpawning();

// --- Game Over handling ---
let isGameOver = false;
let gameOverEl = null;
function checkGameOver() {
    if (isGameOver) return false;
    if (!monsters.length) return false;
    const playerBox = getBox(player);
    for (const m of monsters) {
        const mBox = getBox(m);
        if (playerBox.intersectsBox(mBox)) {
            triggerGameOver();
            return true;
        }
    }
    return false;
}

function triggerGameOver() {
    if (isGameOver) return;
    isGameOver = true;
    stopSpawning();

    gameOverEl = document.createElement('div');
    gameOverEl.textContent = 'Game Over';
    gameOverEl.style.position = 'fixed';
    gameOverEl.style.left = '50%';
    gameOverEl.style.top = '20%';
    gameOverEl.style.transform = 'translate(-50%, -50%)';
    gameOverEl.style.padding = '12px 16px';
    gameOverEl.style.background = 'rgba(0,0,0,0.7)';
    gameOverEl.style.color = '#fff';
    gameOverEl.style.fontFamily = 'monospace';
    gameOverEl.style.fontSize = '24px';
    gameOverEl.style.borderRadius = '6px';
    document.body.appendChild(gameOverEl);

    setTimeout(resetGame, 1500);
}

function resetGame() {
    // Remove overlay
    if (gameOverEl) { gameOverEl.remove(); gameOverEl = null; }

    // Clear monsters from scene and array
    for (const m of monsters) scene.remove(m);
    monsters.splice(0, monsters.length);

    // Reset player position
    player.position.set(0, 0, 10);

    // Reset score
    kills = 0;
    updateKillsUI();

    // Clear visuals
    for (const e of attackEffects) {
        scene.remove(e.mesh);
        e.mesh.geometry.dispose();
        e.mat.dispose();
    }
    attackEffects.length = 0;

    // Respawn initial corner monsters
    for (const [x, y] of spawnCorners) {
        const m = createMonsterAt(x, y);
        monsters.push(m);
        scene.add(m);
    }

    // Resume spawning
    startSpawning();
    isGameOver = false;
}

function animate() {
    const dt = clock.getDelta();
    animatePlayer();
    // Allow monsters to overlap the player only until game over is triggered
    updateMonsters(dt, house, player, { allowPlayerOverlap: !isGameOver });
    updateAttackEffects(dt);
    checkGameOver();
    renderer.render(scene, camera);
}


