import * as THREE from 'three';
import { Camera } from './components/Camera.js';
import { Renderer } from './components/Renderer.js';
import { player, setPlayerMovementSpeed } from './components/Player.js';
import { map, initMap, getMapBounds, houses } from './components/Map.js';
import {
    initMonsters,
    updateMonsters,
    monsters,
    createMonsterAt,
    setEnemyMovementSpeed,
    EnemySpawnDelay,
} from './components/Monsters.js';
import './style.css';
import './collectUserInput.js';
import { animatePlayer } from './animatePlayer.js';
import { getBox, canOccupy } from './colliders.js';

import {
    SCORE_PER_SECOND,
    SCORE_PER_KILL,
    DIFFICULTY_SCORE_PEAK,
    BASE_PLAYER_MOVEMENT_SPEED,
    MAX_PLAYER_MOVEMENT_SPEED,
    BASE_ENEMY_MOVEMENT_SPEED,
    MAX_ENEMY_MOVEMENT_SPEED,
    BASE_ENEMY_SPAWN_DELAY,
    MIN_ENEMY_SPAWN_DELAY,
    BASE_ATTACK_DISTANCE,
    MAX_ATTACK_DISTANCE,
    BASE_ATTACK_DELAY,
    MIN_ATTACK_DELAY,
} from './gameConfig.js';

const scene = new THREE.Scene();
scene.add(player);
scene.add(map);

const ambientLight = new THREE.AmbientLight();
ambientLight.intensity = 1.5;
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight();
dirLight.intensity = 1.5;
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

// SCORE
const scoreEl = document.createElement('div');
scoreEl.className = 'score';
document.body.appendChild(scoreEl);
let score = 0;
function updateScoreUI() {
    scoreEl.textContent = `Score: ${Math.floor(score)}`;
}
updateScoreUI();

// ATTACK
let PlayerAttackDistance = BASE_ATTACK_DISTANCE;
let PlayerAttackDelay = BASE_ATTACK_DELAY;
let lastAttackTime = -Infinity;

function handleClickAttack() {
    const now = clock.getElapsedTime();
    if (now - lastAttackTime < PlayerAttackDelay) return;
    lastAttackTime = now;

    const px = player.position.x;
    const py = player.position.y;
    const r = PlayerAttackDistance;

    const survivors = [];
    let killedThisClick = 0;

    for (const m of monsters) {
        const dx = m.position.x - px;
        const dy = m.position.y - py;

        const mBox = getBox(m);
        const mRadius =
            0.5 * Math.max(mBox.max.x - mBox.min.x, mBox.max.y - mBox.min.y);

        const touchR = r + mRadius;
        if (dx * dx + dy * dy <= touchR * touchR) {
            scene.remove(m);
            killedThisClick++;
        } else {
            survivors.push(m);
        }
    }

    if (killedThisClick > 0) {
        monsters.splice(0, monsters.length, ...survivors);
        score += SCORE_PER_KILL * killedThisClick;
        updateScoreUI();
    }

    spawnAttackEffect();
}

const canvas = document.querySelector('canvas.game');
if (canvas) {
    canvas.addEventListener('click', handleClickAttack);
}
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') handleClickAttack();
});

// ATTACK EFFECTS
const attackEffects = [];
function spawnAttackEffect() {
    const geom = new THREE.CircleGeometry(PlayerAttackDistance, 48);
    const mat = new THREE.MeshBasicMaterial({
        color: 0xffff00,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geom, mat);
    mesh.position.set(player.position.x, player.position.y, 0.2);
    scene.add(mesh);
    attackEffects.push({ mesh, mat, ttl: 0.5 });
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

// SPAWN LOGIC
let enemySpawnTimer = 0;

// Game Over handling
let isGameOver = false;
let gameOverEl = null;

function checkGameOver() {
    if (isGameOver) return false;
    if (!monsters.length) return false;
    const ok = canOccupy(player, player.position.x, player.position.y, {
        dynamicColliders: monsters,
        ignore: [player],
    });
    if (!ok) {
        triggerGameOver();
        return true;
    }
    return false;
}

function triggerGameOver() {
    if (isGameOver) return;
    isGameOver = true;

    gameOverEl = document.createElement('div');
    gameOverEl.textContent = 'Game Over';
    gameOverEl.className = 'game-over';
    document.body.appendChild(gameOverEl);

    setTimeout(resetGame, 1500);
}

function resetGame() {
    if (gameOverEl) {
        gameOverEl.remove();
        gameOverEl = null;
    }

    for (const m of monsters) scene.remove(m);
    monsters.splice(0, monsters.length);

    player.position.set(0, 0, 10);

    score = 0;
    updateScoreUI();

    for (const e of attackEffects) {
        scene.remove(e.mesh);
        e.mesh.geometry.dispose();
        e.mat.dispose();
    }
    attackEffects.length = 0;

    for (const [x, y] of spawnCorners) {
        const m = createMonsterAt(x, y);
        monsters.push(m);
        scene.add(m);
    }

    enemySpawnTimer = 0;
    isGameOver = false;
}

function animate() {
    const dt = clock.getDelta();

    animatePlayer();
    updateMonsters(dt, houses, player, { allowPlayerOverlap: !isGameOver });
    updateAttackEffects(dt);

    // Score: +1 per second survived
    score += SCORE_PER_SECOND * dt;
    updateScoreUI();

    // Difficulty scaling based on score (0..1)
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    const t = clamp(score / DIFFICULTY_SCORE_PEAK, 0, 1);

    const spawnDelay =
        BASE_ENEMY_SPAWN_DELAY +
        (MIN_ENEMY_SPAWN_DELAY - BASE_ENEMY_SPAWN_DELAY) * t;
    const enemySpeed =
        BASE_ENEMY_MOVEMENT_SPEED +
        (MAX_ENEMY_MOVEMENT_SPEED - BASE_ENEMY_MOVEMENT_SPEED) * t;
    const playerSpeed =
        BASE_PLAYER_MOVEMENT_SPEED +
        (MAX_PLAYER_MOVEMENT_SPEED - BASE_PLAYER_MOVEMENT_SPEED) * t;

    PlayerAttackDelay =
        BASE_ATTACK_DELAY + (MIN_ATTACK_DELAY - BASE_ATTACK_DELAY) * t;
    PlayerAttackDistance =
        BASE_ATTACK_DISTANCE +
        (MAX_ATTACK_DISTANCE - BASE_ATTACK_DISTANCE) * t;

    setEnemyMovementSpeed(enemySpeed);
    setPlayerMovementSpeed(playerSpeed);

    // Spawn enemies over time using dt
    if (!isGameOver) {
        enemySpawnTimer += dt;
        const delay = spawnDelay || EnemySpawnDelay || BASE_ENEMY_SPAWN_DELAY;
        if (enemySpawnTimer >= delay) {
            enemySpawnTimer = 0;
            const [x, y] =
                spawnCorners[(Math.random() * spawnCorners.length) | 0];
            const m = createMonsterAt(x, y);
            monsters.push(m);
            scene.add(m);
        }
    }

    checkGameOver();
    renderer.render(scene, camera);
}
