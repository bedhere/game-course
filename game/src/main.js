import * as THREE from 'three';
import './style.css';
import player, { getNextMove, update, consumeAttack, resetPlayer } from './components/Player.js';
import camera, { updateCamera } from './components/Camera.js';
import renderer from './components/Renderer.js';
import { init as initEnemies, update as updateEnemies, removeEnemiesInRadius, isPositionBlocked, clearAllEnemies, respawnEnemies } from './components/Enemy.js';
import map from './components/Map.js';
import { init as initHouses, isHouseBlocked, clearAllHouses, respawnHouses } from './components/House.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB);

// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(-100, -100, 200);
scene.add(directionalLight);

// Checkerboard floor
scene.add(map);

// Add player to scene
scene.add(player);

// Camera added to scene (follows player via updateCamera)
scene.add(camera);

// Initialize enemy system
initEnemies(scene);

// Initialize houses
initHouses(scene);

// Game state
let gameOver = false;
let paused = false;
let score = 0;
const overlay = document.querySelector('.game-over');
const pauseBtn = document.querySelector('.pause-btn');
const pauseOverlay = document.querySelector('.pause-overlay');
const scoreDiv = document.querySelector('.score');

renderer.setPixelRatio(window.devicePixelRatio);

// Animation loop
let lastTime = 0;

renderer.setAnimationLoop((time) => {
  const deltaTime = lastTime === 0 ? 0 : (time - lastTime) / 1000;
  lastTime = time;

  if (!gameOver && !paused) {
    getNextMove();
    update(deltaTime);
    updateEnemies(deltaTime, player);

    // Survival score: 0.1 point per second
    score += 0.1 * deltaTime;

    // Attack: remove enemies within attack radius
    const radius = consumeAttack();
    if (radius > 0) {
      const killed = removeEnemiesInRadius(player.position.x, player.position.y, radius);
      score += killed * 10; // 10 points per kill
    }

    // Check Game Over: player colliding with any enemy
    if (isPositionBlocked(player.position.x, player.position.y)) {
      gameOver = true;
      player.visible = false;
      overlay.style.display = 'block';
    }

    // Update score display
    scoreDiv.textContent = '分数: ' + Math.floor(score);
  }

  // Smooth camera follow
  updateCamera(player.position);

  renderer.render(scene, camera);
});

// Reset handler: Space key during Game Over
window.addEventListener('keydown', (e) => {
  if (e.key === ' ' && gameOver) {
    e.preventDefault();
    gameOver = false;
    overlay.style.display = 'none';
    score = 0;
    scoreDiv.textContent = '分数: 0';
    resetPlayer();
    clearAllEnemies();
    respawnEnemies();
    clearAllHouses();
    respawnHouses(scene);
  }
});

// Pause toggle: button click or Escape key
function togglePause() {
  if (gameOver) return; // can't pause when game is over
  paused = !paused;
  pauseBtn.textContent = paused ? '▶ 继续' : '⏸ 暂停';
  pauseOverlay.style.display = paused ? 'block' : 'none';
}

pauseBtn.addEventListener('click', togglePause);

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    e.preventDefault();
    togglePause();
  }
});
