import * as THREE from 'three';

export function getBox(obj, out) {
  const box = out || new THREE.Box3();
  const src = obj && obj.userData && obj.userData.collider ? obj.userData.collider : obj;
  return box.setFromObject(src);
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

export function isInsideBounds(x, y, bounds, margin = 0) {
    return (
        x >= bounds.minX + margin &&
        x <= bounds.maxX - margin &&
        y >= bounds.minY + margin &&
        y <= bounds.maxY - margin
    );
}

// Build Box3 array for given objects
export function getBoxes(objs) {
  if (!objs || !objs.length) return [];
  const out = new Array(objs.length);
  for (let i = 0; i < objs.length; i++) out[i] = getBox(objs[i]);
  return out;
}

// Generic occupancy check for any moving object (player, monster, etc.)
// Tests tentative box of `obj` at (x, y) against all provided colliders.
export function canOccupy(
  obj,
  x,
  y,
  { staticColliders = [], dynamicColliders = [], ignore = [] } = {}
) {
  const pBox = getTentativeBox(obj, x, y);
  // Check static
  if (staticColliders && staticColliders.length) {
    for (const s of staticColliders) {
      if (!s || ignore.includes(s) || s === obj) continue;
      const sBox = getBox(s);
      if (pBox.intersectsBox(sBox)) return false;
    }
  }
  // Check dynamic
  if (dynamicColliders && dynamicColliders.length) {
    for (const d of dynamicColliders) {
      if (!d || ignore.includes(d) || d === obj) continue;
      const dBox = getBox(d);
      if (pBox.intersectsBox(dBox)) return false;
    }
  }
  return true;
}
