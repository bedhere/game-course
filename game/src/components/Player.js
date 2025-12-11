import * as THREE from 'three';
import { houses } from './Map.js';
import { monsters } from './Monsters.js';
import { canOccupy } from '../colliders.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export const player = new THREE.Group();

(function initPlayer() {
    const loader = new GLTFLoader();
    loader.load(
        '/models/Frog.glb',
        (gltf) => {
            console.log('MODEL LOADED', gltf.scene);

            const frog = gltf.scene;

            frog.scale.set(30, 30, 30);
            frog.rotation.x = Math.PI / 2;
            frog.position.set(0, 0, 0);

            frog.traverse((obj) => {
                if (obj.isMesh) {
                    obj.castShadow = true;
                    obj.receiveShadow = true;
                }
            });

            player.add(frog);
            player.userData.frog = frog;
        },
        undefined,
        (err) => {
            console.error('LOAD ERROR', err);
        }
    );

    player.position.set(0, 0, 10);
})();

export const movesQueue = [];

export function queueMove(direction) {
    if (movesQueue.length >= 2) return;
    movesQueue.push(direction);
}

export function stepCompleted() {
    const direction = movesQueue.shift();
    if (!direction) return;

    let nextX = player.position.x;
    let nextY = player.position.y;
    if (direction === 'left') nextX -= 10;
    if (direction === 'right') nextX += 10;
    if (direction === 'forward') nextY += 10;
    if (direction === 'backward') nextY -= 10;

    const ok = canOccupy(player, nextX, nextY, { staticColliders: houses || [], dynamicColliders: monsters });
    if (!ok) return;

    player.position.x = nextX;
    player.position.y = nextY;
}
