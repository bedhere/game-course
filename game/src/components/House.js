import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const HOUSE_COUNT = 3;
const HOUSE_SCALE = 65;
const HOUSE_RADIUS = 50; // collision radius for each house
const MAP_HALF = 1000; // half the map size (2000 / 2)
const MARGIN = 200; // min distance from center (player spawn)

const houses = []; // { group, x, y, radius }

/**
 * Generate a random position on the map, avoiding the center area.
 */
function randomPosition() {
  const angle = Math.random() * Math.PI * 2;
  const dist = MARGIN + Math.random() * (MAP_HALF - MARGIN);
  return {
    x: Math.cos(angle) * dist,
    y: Math.sin(angle) * dist,
  };
}

/**
 * Load all houses and add them to the scene.
 */
function init(scene) {
  const loader = new GLTFLoader();

  for (let i = 0; i < HOUSE_COUNT; i++) {
    loader.load('/models/small_house.glb', (gltf) => {
      const model = gltf.scene;
      const houseGroup = new THREE.Group();

      model.rotation.x = Math.PI / 2;
      model.scale.setScalar(HOUSE_SCALE);

      // Sit on the ground
      const box = new THREE.Box3().setFromObject(model);
      model.position.z = -box.min.z;

      houseGroup.add(model);

      const pos = randomPosition();
      houseGroup.position.set(pos.x, pos.y, 0);
      houseGroup.rotation.z =
        Math.floor(Math.random() * 4) * (Math.PI / 2);

      scene.add(houseGroup);
      houses.push({ group: houseGroup, x: pos.x, y: pos.y, radius: HOUSE_RADIUS });
    });
  }
}

/**
 * Check whether a position overlaps with any house.
 */
function isHouseBlocked(x, y) {
  for (const house of houses) {
    const dx = house.x - x;
    const dy = house.y - y;
    if (Math.sqrt(dx * dx + dy * dy) < house.radius) {
      return true;
    }
  }
  return false;
}

/**
 * Remove all houses from the scene and array.
 */
function clearAllHouses() {
  for (const house of houses) {
    house.group.parent?.remove(house.group);
  }
  houses.length = 0;
}

/**
 * Respawn houses after clearing (call with scene).
 */
function respawnHouses(scene) {
  init(scene);
}

export { init, isHouseBlocked, clearAllHouses, respawnHouses };
