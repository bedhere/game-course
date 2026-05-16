import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { isHouseBlocked } from './House.js';

const ENEMY_SPEED = 60;
const SPAWN_DELAY = 3;
const COLLISION_DISTANCE = 20;

// Four corners of the map
const SPAWN_LOCATIONS = [
  { x: -500, y: -500 },
  { x: 500, y: -500 },
  { x: -500, y: 500 },
  { x: 500, y: 500 },
];

const enemies = [];
let timeSinceLastSpawn = 0;
let scene = null;

/**
 * Load the enemy model and place it at a spawn location.
 */
function createEnemy(position) {
  const enemyGroup = new THREE.Group();
  enemyGroup.position.set(position.x, position.y, 0);

  const enemyWrapper = new THREE.Group();
  enemyGroup.add(enemyWrapper);

  const loader = new GLTFLoader();
  loader.load('/models/enemy.glb', (gltf) => {
    const model = gltf.scene;

    model.rotation.x = Math.PI / 2;
    model.scale.setScalar(5);

    // Sit flush on the ground
    const box = new THREE.Box3().setFromObject(model);
    model.position.z = -box.min.z;

    enemyWrapper.add(model);
  });

  scene.add(enemyGroup);
  enemies.push({ group: enemyGroup, wrapper: enemyWrapper });
}

/**
 * Spawn initial enemies at all four corners.
 */
function init(sceneRef) {
  scene = sceneRef;
  SPAWN_LOCATIONS.forEach((loc) => createEnemy(loc));
  timeSinceLastSpawn = 0;
}

/**
 * Check whether a position overlaps with any existing enemy.
 */
function isPositionBlocked(x, y) {
  for (const enemy of enemies) {
    const dx = enemy.group.position.x - x;
    const dy = enemy.group.position.y - y;
    if (Math.sqrt(dx * dx + dy * dy) < COLLISION_DISTANCE) {
      return true;
    }
  }
  return false;
}

/**
 * Called each frame: spawn new enemies on a timer, and move all
 * existing enemies toward the player (collision-aware).
 */
function update(deltaTime, playerGroup) {
  timeSinceLastSpawn += deltaTime;

  // Periodic spawning
  if (timeSinceLastSpawn >= SPAWN_DELAY) {
    timeSinceLastSpawn = 0;
    const loc =
      SPAWN_LOCATIONS[Math.floor(Math.random() * SPAWN_LOCATIONS.length)];
    createEnemy(loc);
  }

  // Move each enemy toward the player
  for (let i = 0; i < enemies.length; i++) {
    const enemy = enemies[i];
    const dx = playerGroup.position.x - enemy.group.position.x;
    const dy = playerGroup.position.y - enemy.group.position.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > 0.1) {
      const dirX = dx / dist;
      const dirY = dy / dist;

      const newX = enemy.group.position.x + dirX * ENEMY_SPEED * deltaTime;
      const newY = enemy.group.position.y + dirY * ENEMY_SPEED * deltaTime;

      // Check collision with other enemies
      let blocked = false;
      for (let j = 0; j < enemies.length; j++) {
        if (i === j) continue;
        const edx = enemies[j].group.position.x - newX;
        const edy = enemies[j].group.position.y - newY;
        if (Math.sqrt(edx * edx + edy * edy) < COLLISION_DISTANCE) {
          blocked = true;
          break;
        }
      }

      if (blocked) continue; // blocked by another enemy

      // Check collision with houses
      if (isHouseBlocked(newX, newY)) continue;

      enemy.group.position.x = newX;
      enemy.group.position.y = newY;

      // Face the player
      const angle = Math.atan2(dy, dx);
      enemy.wrapper.rotation.z = angle + Math.PI / 2;
    }
  }
}

/**
 * Remove all enemies within radius of center. Returns count of removed.
 */
function removeEnemiesInRadius(centerX, centerY, radius) {
  let removed = 0;
  for (let i = enemies.length - 1; i >= 0; i--) {
    const enemy = enemies[i];
    const dx = enemy.group.position.x - centerX;
    const dy = enemy.group.position.y - centerY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist <= radius) {
      scene.remove(enemy.group);
      enemies.splice(i, 1);
      removed++;
    }
  }
  return removed;
}

/**
 * Remove all enemies from the scene and array.
 */
function clearAllEnemies() {
  for (const enemy of enemies) {
    scene.remove(enemy.group);
  }
  enemies.length = 0;
}

/**
 * Respawn enemies at corners after clearing.
 */
function respawnEnemies() {
  SPAWN_LOCATIONS.forEach((loc) => createEnemy(loc));
  timeSinceLastSpawn = 0;
}

export { init, update, removeEnemiesInRadius, isPositionBlocked, clearAllEnemies, respawnEnemies };
