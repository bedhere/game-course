import * as THREE from 'three';

const camera = new THREE.PerspectiveCamera(
  30,
  window.innerWidth / window.innerHeight,
  0.1,
  9000,
);

camera.up.set(0, 0, 1);

// ─── Orbit parameters ────────────────────────────────────────

const RADIUS = 520;
let theta = Math.PI / 4;
let phi = Math.PI / 3;

// Smoothed values (actual camera position uses these)
let smoothTheta = theta;
let smoothPhi = phi;
const smoothTarget = new THREE.Vector3(0, 0, 0);

const DAMPING = 0.08; // lower = smoother, higher = snappier

// ─── Camera update (called every frame) ──────────────────────

function updateCamera(playerPosition) {
  // Lerp smoothed angles toward target angles
  smoothTheta += (theta - smoothTheta) * DAMPING;
  smoothPhi += (phi - smoothPhi) * DAMPING;

  // Lerp look-at target toward player world position
  smoothTarget.lerp(playerPosition, DAMPING);

  const sinPhi = Math.sin(smoothPhi);
  camera.position.set(
    smoothTarget.x + RADIUS * sinPhi * Math.cos(smoothTheta),
    smoothTarget.y + RADIUS * sinPhi * Math.sin(smoothTheta),
    smoothTarget.z + RADIUS * Math.cos(smoothPhi),
  );
  camera.lookAt(smoothTarget);
}

// ─── Mouse orbit (left-click toggles on/off) ────────────────

let orbitEnabled = true;
let lastX = 0;
let lastY = 0;

window.addEventListener('mousedown', (e) => {
  if (e.button === 2) {
    orbitEnabled = !orbitEnabled;
  }
});

window.addEventListener('contextmenu', (e) => e.preventDefault());

window.addEventListener('mousemove', (e) => {
  if (!orbitEnabled) {
    lastX = e.clientX;
    lastY = e.clientY;
    return;
  }

  const dx = e.clientX - lastX;
  const dy = e.clientY - lastY;
  lastX = e.clientX;
  lastY = e.clientY;

  theta -= dx * 0.005;
  phi = Math.max(0.2, Math.min(Math.PI / 2 - 0.05, phi + dy * 0.005));
});

// ─── Resize ──────────────────────────────────────────────────

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

function getCameraTheta() {
  return smoothTheta;
}

export default camera;
export { updateCamera, getCameraTheta };
