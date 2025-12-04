import * as THREE from 'three';
import { getBox, getTentativeBox, intersectsAny, getHouseBox } from '../colliders.js';

export const monsters = [];

// Player is ~5 units/sec (1 unit per 0.2s).
// Per request: make monsters roughly twice as fast as before but still slower than player.
// Updated per latest request: make monsters move twice as fast as they do now.
// Previously 4.8 u/s -> now 9.6 u/s.
const speed = 9.6; // units per second

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

export function updateMonsters(dt, house, player, { allowPlayerOverlap = true } = {}) {
  if (!monsters.length) return;

  // Prepare current boxes
  const playerBox = getBox(player);
  const houseBox = getHouseBox(house);

  // We'll update sequentially; use boxes of already-updated monsters to prevent overlaps
  const updatedBoxes = [];

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

    // Tentative box at next position using shared helper
    const tentativeBox = getTentativeBox(m, nextPos.x, nextPos.y);

    let collide = false;
    // If moving into the player, allow the overlap only when enabled (pre-game-over)
    if (tentativeBox.intersectsBox(playerBox)) {
      if (allowPlayerOverlap) {
        // Allow entering player's space so main game-over check can detect it
        m.position.x = nextPos.x;
        m.position.y = nextPos.y;
        updatedBoxes.push(tentativeBox);
        continue;
      } else {
        collide = true;
      }
    }
    if (houseBox && tentativeBox.intersectsBox(houseBox)) collide = true;
    if (!collide) {
      for (const b of updatedBoxes) {
        if (tentativeBox.intersectsBox(b)) { collide = true; break; }
      }
    }

    if (collide) {
      // Stay in place; add current box
      updatedBoxes.push(getBox(m));
    } else {
      // Commit move and record the new box
      m.position.x = nextPos.x;
      m.position.y = nextPos.y;
      updatedBoxes.push(tentativeBox);
    }
  }
}
