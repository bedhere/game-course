import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { isPositionBlocked } from './Enemy.js';
import { isHouseBlocked } from './House.js';

const MOVE_SPEED = 2;
const JUMP_HEIGHT = 50;
const JUMP_DISTANCE = 100;

const ATTACK_COOLDOWN = 1;
const ATTACK_RADIUS = 60;
const ATTACK_DURATION = 0.2;

const playerGroup = new THREE.Group();
let model = null;
let modelWrapper = null;
let attackIndicator = null;

const inputQueue = [];
let currentMove = null;

// Attack state
let cooldownTimer = 0;
let attackTimer = 0;
let attackTriggered = false;

// Map keys to movement direction angles (in XY plane)
const directionMap = {
  ArrowUp: Math.PI / 2,
  ArrowDown: -Math.PI / 2,
  ArrowLeft: Math.PI,
  ArrowRight: 0,
  w: Math.PI / 2,
  s: -Math.PI / 2,
  a: Math.PI,
  d: 0,
};

window.addEventListener('keydown', (e) => {
  if (e.key in directionMap) {
    e.preventDefault();
    inputQueue.push(directionMap[e.key]);
  }
  if (e.key === ' ') {
    e.preventDefault();
    if (cooldownTimer <= 0 && attackTimer <= 0) {
      attackTriggered = true;
    }
  }
});

const loader = new GLTFLoader();
loader.load('/models/tode.glb', (gltf) => {
  model = gltf.scene;
  modelWrapper = new THREE.Group();

  model.rotation.x = Math.PI / 2;
  model.scale.setScalar(20);

  // Calculate Z-offset so the model sits flush on the ground
  const box = new THREE.Box3().setFromObject(model);
  model.position.z = -box.min.z;

  modelWrapper.add(model);
  playerGroup.add(modelWrapper);

  // Create attack indicator (yellow circle on the ground)
  const circleGeom = new THREE.CircleGeometry(ATTACK_RADIUS, 32);
  const circleMat = new THREE.MeshBasicMaterial({
    color: 0xFFFF00,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.6,
  });
  attackIndicator = new THREE.Mesh(circleGeom, circleMat);
  attackIndicator.position.z = 0.25;
  attackIndicator.visible = false;
  playerGroup.add(attackIndicator);
});

/**
 * Pull next input from queue and start a new move if idle
 * and the destination is not blocked by enemies.
 */
function getNextMove() {
  if (!currentMove && inputQueue.length > 0) {
    const direction = inputQueue.shift();
    const targetX = playerGroup.position.x + Math.cos(direction) * JUMP_DISTANCE;
    const targetY = playerGroup.position.y + Math.sin(direction) * JUMP_DISTANCE;

    if (!isPositionBlocked(targetX, targetY) && !isHouseBlocked(targetX, targetY)) {
      currentMove = {
        direction,
        progress: 0,
        startX: playerGroup.position.x,
        startY: playerGroup.position.y,
      };
    }
  }
}

/**
 * Advance the current move and manage attack timers.
 * Returns the attack radius if an attack just triggered, otherwise 0.
 */
function update(deltaTime) {
  // --- Movement ---
  if (currentMove) {
    currentMove.progress += deltaTime * MOVE_SPEED;

    if (currentMove.progress >= 1) {
      const dir = currentMove.direction;
      playerGroup.position.x = currentMove.startX + Math.cos(dir) * JUMP_DISTANCE;
      playerGroup.position.y = currentMove.startY + Math.sin(dir) * JUMP_DISTANCE;
      playerGroup.position.z = 0;
      currentMove = null;
    } else {
      const dir = currentMove.direction;
      const progress = currentMove.progress;

      playerGroup.position.z = Math.sin(progress * Math.PI) * JUMP_HEIGHT;
      playerGroup.position.x = currentMove.startX + Math.cos(dir) * JUMP_DISTANCE * progress;
      playerGroup.position.y = currentMove.startY + Math.sin(dir) * JUMP_DISTANCE * progress;

      if (modelWrapper) {
        modelWrapper.rotation.z = dir + Math.PI / 2;
      }
    }
  }

  // --- Attack cooldown ---
  if (cooldownTimer > 0) {
    cooldownTimer -= deltaTime;
    if (cooldownTimer < 0) cooldownTimer = 0;
  }

  // --- Attack visual ---
  if (attackTimer > 0) {
    attackTimer -= deltaTime;
    if (attackTimer <= 0) {
      attackTimer = 0;
      if (attackIndicator) attackIndicator.visible = false;
    }
  }

  // --- Start attack if triggered ---
  if (attackTriggered && cooldownTimer <= 0) {
    attackTriggered = false;
    cooldownTimer = ATTACK_COOLDOWN;
    attackTimer = ATTACK_DURATION;
    if (attackIndicator) attackIndicator.visible = true;
  }
}

/**
 * Consume and return the attack radius if an attack just started.
 */
function consumeAttack() {
  if (attackTimer === ATTACK_DURATION && cooldownTimer === ATTACK_COOLDOWN) {
    return ATTACK_RADIUS;
  }
  return 0;
}

/**
 * Reset the player to the starting state.
 */
function resetPlayer() {
  playerGroup.position.set(0, 0, 0);
  playerGroup.visible = true;
  inputQueue.length = 0;
  currentMove = null;
  cooldownTimer = 0;
  attackTimer = 0;
  attackTriggered = false;
  if (attackIndicator) attackIndicator.visible = false;
}

export { playerGroup as default, getNextMove, update, consumeAttack, resetPlayer };
