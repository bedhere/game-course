import * as THREE from 'three';
import { canOccupy, isInsideBounds } from '../colliders.js';
import { getMapBounds } from './Map.js';

export const monsters = [];

const speed = 9.6; // units per second
const bounds = getMapBounds();

export function initMonsters(bounds) {
  // Create 4 red cubes at map corners
  const corners = [
    [bounds.minX, bounds.minY],
    [bounds.maxX, bounds.minY],
    [bounds.minX, bounds.maxY],
    [bounds.maxX, bounds.maxY],
  ];

  for (const [x, y] of corners) {
    const cube = createMonsterAt(x, y);
    monsters.push(cube);
  }

  return monsters;
}

// Minimal helper to spawn a single monster at a given corner/position
export function createMonsterAt(x, y) {
  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(15, 15, 15),
    new THREE.MeshLambertMaterial({ color: 'red', flatShading: true })
  );
  cube.position.set(x, y, 7.5);
  return cube;
}

export function updateMonsters(dt, houses, player, { allowPlayerOverlap = true } = {}) {
  if (!monsters.length) return;

  const staticColliders = Array.isArray(houses) ? houses : (houses ? [houses] : []);

  for (const m of monsters) {
    const dir = new THREE.Vector3(
      player.position.x - m.position.x,
      player.position.y - m.position.y,
      0
    );
    const len = dir.length();
    if (len > 0.0001) dir.multiplyScalar(1 / len);

    const step = speed * dt;
    const nextPos = new THREE.Vector3(
      m.position.x + dir.x * step,
      m.position.y + dir.y * step,
      m.position.z
    );

      // Stay within map bounds
      if (!isInsideBounds(nextPos.x, nextPos.y, bounds)) {
          continue;
      }

    // Build dynamic colliders: all monsters and optionally the player
    const dynamicColliders = allowPlayerOverlap ? monsters : [player, ...monsters];
    const ok = canOccupy(m, nextPos.x, nextPos.y, {
      staticColliders,
      dynamicColliders,
      ignore: [m],
    });
    if (ok) {
      m.position.x = nextPos.x;
      m.position.y = nextPos.y;
    }
  }
}
