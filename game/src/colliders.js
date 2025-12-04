import * as THREE from 'three';

// Cache for static objects like house
const houseBoxCache = new WeakMap();

export function getBox(obj, out) {
  const box = out || new THREE.Box3();
  return box.setFromObject(obj);
}

export function getHouseBox(house) {
  if (!house) return null;
  let cached = houseBoxCache.get(house);
  if (!cached) {
    cached = getBox(house);
    houseBoxCache.set(house, cached);
  }
  return cached;
}

export function intersectsAny(box, boxes) {
  if (!boxes || boxes.length === 0) return false;
  for (const b of boxes) {
    if (box.intersectsBox(b)) return true;
  }
  return false;
}

export function getTentativeBox(obj, x, y, out) {
  const oldX = obj.position.x;
  const oldY = obj.position.y;
  obj.position.x = x;
  obj.position.y = y;
  const box = getBox(obj, out);
  // revert immediately
  obj.position.x = oldX;
  obj.position.y = oldY;
  return box;
}

// Generic occupancy check for any moving object (player/monster)
// Note: signature intentionally includes the object to avoid circular imports.
export function canOccupyPlayer(obj, x, y, { house, monsters }) {
  const pBox = getTentativeBox(obj, x, y);

  const hBox = getHouseBox(house);
  if (hBox && pBox.intersectsBox(hBox)) return false;

  if (monsters && monsters.length) {
    // Compute each monster box on demand
    for (const m of monsters) {
      const mBox = getBox(m);
      if (pBox.intersectsBox(mBox)) return false;
    }
  }
  return true;
}
