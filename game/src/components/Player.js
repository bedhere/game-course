import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { isPositionBlocked } from './Enemy.js';
import { isHouseBlocked } from './House.js';
import { getCameraTheta } from './Camera.js';

const MOVE_SPEED = 200;
const JUMP_HEIGHT = 125; // 1.25 blocks
const JUMP_DURATION = 0.8; // seconds for full arc

const ATTACK_COOLDOWN = 1;
const ATTACK_RADIUS = 60;
const ATTACK_DURATION = 0.2;

const playerGroup = new THREE.Group();
let model = null;
let modelWrapper = null;
let attackIndicator = null;

// Track currently held keys
const keysHeld = new Set();

// Jump state
let isJumping = false;
let jumpTime = 0;

// Attack state
let cooldownTimer = 0;
let attackTimer = 0;
let attackTriggered = false;

window.addEventListener('keydown', (e) => {
  if (['w', 's', 'a', 'd', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
    e.preventDefault();
    keysHeld.add(e.key);
  }
  if (e.key === ' ') {
    e.preventDefault();
    if (!isJumping) {
      isJumping = true;
      jumpTime = 0;
    }
  }
});

window.addEventListener('keyup', (e) => {
  keysHeld.delete(e.key);
});

// Left mouse button = attack
window.addEventListener('mousedown', (e) => {
  if (e.button === 0) {
    e.preventDefault();
    if (cooldownTimer <= 0 && attackTimer <= 0) {
      attackTriggered = true;
    }
  }
});

// Convert held keys to a movement vector in world space
function getMovementVector() {
  const theta = getCameraTheta();
  // Forward/backward along camera view direction
  const forward = new THREE.Vector2(Math.cos(theta), Math.sin(theta));
  // Right is 90° clockwise from forward
  const right = new THREE.Vector2(forward.y, -forward.x);

  const dir = new THREE.Vector2(0, 0);

  if (keysHeld.has('w') || keysHeld.has('ArrowUp'))    dir.sub(forward);
  if (keysHeld.has('s') || keysHeld.has('ArrowDown'))  dir.add(forward);
  if (keysHeld.has('d') || keysHeld.has('ArrowRight')) dir.sub(right);
  if (keysHeld.has('a') || keysHeld.has('ArrowLeft'))  dir.add(right);

  if (dir.lengthSq() > 0) dir.normalize();
  return dir;
}

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
 * Advance movement and manage attack timers.
 * Returns the attack radius if an attack just triggered, otherwise 0.
 */
function update(deltaTime) {
  // --- Jump ---
  if (isJumping) {
    jumpTime += deltaTime / JUMP_DURATION;
    if (jumpTime >= 1) {
      jumpTime = 1;
      isJumping = false;
    }
    // Parabolic arc: peaks at jumpTime=0.5
    playerGroup.position.z = 4 * JUMP_HEIGHT * jumpTime * (1 - jumpTime);
  } else {
    playerGroup.position.z = 0;
  }

  // --- Continuous movement ---
  const dir = getMovementVector();
  if (dir.lengthSq() > 0) {
    const newX = playerGroup.position.x + dir.x * MOVE_SPEED * deltaTime;
    const newY = playerGroup.position.y + dir.y * MOVE_SPEED * deltaTime;

    if (!isPositionBlocked(newX, newY) && !isHouseBlocked(newX, newY)) {
      playerGroup.position.x = newX;
      playerGroup.position.y = newY;
    }

    // Rotate model to face movement direction
    if (modelWrapper) {
      modelWrapper.rotation.z = Math.atan2(dir.y, dir.x) + Math.PI / 2;
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
  keysHeld.clear();
  isJumping = false;
  jumpTime = 0;
  cooldownTimer = 0;
  attackTimer = 0;
  attackTriggered = false;
  if (attackIndicator) attackIndicator.visible = false;
}

// getNextMove is no longer needed but kept for API compatibility
function getNextMove() {}

export { playerGroup as default, getNextMove, update, consumeAttack, resetPlayer };
