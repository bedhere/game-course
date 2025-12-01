import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

/**
 * Loads and prepares the
 * Small House by Jarlan Perez [CC-BY] via Poly Pizza
 *
 * @param {Object} [options]
 * @param {string} [options.url] - URL of the GLB file (served from `public`).
 * @param {[number, number, number]} [options.position] - [x, y, z] position.
 * @param {number} [options.scale] - Uniform scale factor.
 * @param {number} [options.rotationX] - Rotation around X (to convert Y-up to Z-up).
 * @param {boolean} [options.castShadow]
 * @param {boolean} [options.receiveShadow]
 * @returns {Promise<THREE.Object3D>} resolves to the house Object3D ready to add to the scene.
 */
export async function loadHouse(options = {}) {
  const {
    url = '/models/Small House.glb',
    position = [-100, 100, 0],
    scale = 70,
    groundMargin = 0.01,
    castShadow = true,
    receiveShadow = true,
  } = options;

  const loader = new GLTFLoader();
  const gltf = await loader.loadAsync(url);
  const house = gltf.scene;

  house.rotation.x = Math.PI / 2
  house.rotation.y = Math.PI
  house.scale.setScalar(scale);
  house.updateWorldMatrix(true, true);

  let bbox = new THREE.Box3().setFromObject(house);
  const zLift = -bbox.min.z + groundMargin;

  house.position.set(position[0], position[1], position[2] + zLift);

  house.traverse((obj) => {
    if (obj.isMesh) {
      obj.castShadow = !!castShadow;
      obj.receiveShadow = !!receiveShadow;
    }
  });

  return house;
}
