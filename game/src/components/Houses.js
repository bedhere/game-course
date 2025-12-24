import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
const loader = new GLTFLoader();

/**
 * Loads and prepares a house model used in this project.
 *
 * The project currently uses these Poly Pizza assets:
 * - Small_House.glb — Small House by Jarlan Perez [CC-BY] via Poly Pizza
 * - Green_House.glb — House by jeremy [CC-BY] via Poly Pizza
 * - Brown_House.glb — House by jeremy [CC-BY] via Poly Pizza
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
        url,
        position = [0, 0, 0],
        scale = 5,
        groundMargin = 0.01,
        castShadow = true,
        receiveShadow = true,
    } = options;

    if (!url) {
        throw new Error('loadHouse: "url" is required');
    }

    const gltf = await loader.loadAsync(url);
    const house = gltf.scene;

    house.rotation.x = Math.PI / 2;
    house.rotation.y = Math.PI;
    house.scale.setScalar(scale);
    house.updateWorldMatrix(true, true);

    const bbox = new THREE.Box3().setFromObject(house);
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

export async function loadHouses() {
    const h0 = await loadHouse({
        url: '/models/Small_House.glb',
        position: [200, 100, 0],
        scale: 70,
    });

    const h1 = await loadHouse({
        url: '/models/Green_House.glb',
        position: [-100, 100, 0],
        scale: 10,
    });
    h1.rotation.y -= Math.PI / 2;

    const h2 = await loadHouse({
        url: '/models/Brown_House.glb',
        position: [0, -200, 0],
        scale: 20,
    });

    return [h0, h1, h2];
}