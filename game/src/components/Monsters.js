/**
 * Asset attribution
 * - Monster.glb — Armabee Evolved by Quaternius [Public Domain] via Poly Pizza
 *   https://poly.pizza/m/GcttdvsqsQ
 */
import * as THREE from 'three';
import { canOccupy, isInsideBounds } from '../colliders.js';
import { getMapBounds } from './Map.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export const monsters = [];

import { BASE_ENEMY_MOVEMENT_SPEED, BASE_ENEMY_SPAWN_DELAY } from '../gameConfig.js';

export let EnemyMovementSpeed = BASE_ENEMY_MOVEMENT_SPEED; // units per second
export let EnemySpawnDelay = BASE_ENEMY_SPAWN_DELAY;       // seconds

export function setEnemyMovementSpeed(v) { EnemyMovementSpeed = v; }
export function setEnemySpawnDelay(v) { EnemySpawnDelay = v; }

const bounds = getMapBounds();

const loader = new GLTFLoader();

export function initMonsters(bounds) {
    // Create 4 monsters (with cube hitboxes) at map corners
    const corners = [
        [bounds.minX, bounds.minY],
        [bounds.maxX, bounds.minY],
        [bounds.minX, bounds.maxY],
        [bounds.maxX, bounds.maxY],
    ];

    for (const [x, y] of corners) {
        const m = createMonsterAt(x, y);
        monsters.push(m);
    }

    return monsters;
}

// Minimal helper to spawn a single monster at a given corner/position
export function createMonsterAt(x, y) {
    const cube = new THREE.Mesh(
        new THREE.BoxGeometry(12, 12, 12),
        new THREE.MeshLambertMaterial({ color: 'red', flatShading: true })
    );
    cube.position.set(x, y, 7.5);

    // Mark this cube as the explicit collider so Box3 uses only it
    cube.userData.collider = cube;

    // BoxGeometry for collision detection
    cube.material.transparent = true;
    cube.material.opacity = 0;

    loader.load(
        '/models/Monster.glb',
        (gltf) => {
            const model = gltf.scene;
            const clips = gltf.animations || [];

            model.rotation.x = Math.PI / 2;
            model.position.set(0, 0, 0);
            model.updateWorldMatrix(true, true);

            const bbox = new THREE.Box3().setFromObject(model);
            const size = bbox.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z) || 1;
            const desiredSize = 18;
            const s = desiredSize / maxDim;

            model.scale.setScalar(s);
            model.updateWorldMatrix(true, true);

            const bbox2 = new THREE.Box3().setFromObject(model);
            const center = bbox2.getCenter(new THREE.Vector3());
            model.position.sub(center);

            cube.add(model);
            cube.userData.model = model;

            if (clips.length) {
                const mixer = new THREE.AnimationMixer(model);

                const fastClip =
                    clips.find((c) => c.name.includes('Fast_Flying')) || clips[0];

                const flyAction = mixer.clipAction(fastClip);
                flyAction.play();

                cube.userData.mixer = mixer;
            }
        },
        undefined,
        (err) => {
            console.error('Failed to load Monster.glb', err);
        }
    );

    return cube;
}

export function updateMonsters(
    dt,
    houses,
    player,
    { allowPlayerOverlap = true } = {}
) {
    if (!monsters.length) return;

    for (const m of monsters) {
        if (m.userData.mixer) m.userData.mixer.update(dt);
    }

    const staticColliders = Array.isArray(houses)
        ? houses
        : houses
            ? [houses]
            : [];

    for (const m of monsters) {
        const dir = new THREE.Vector3(
            player.position.x - m.position.x,
            player.position.y - m.position.y,
            0
        );
        const len = dir.length();
        if (len > 0.0001) {
            dir.multiplyScalar(1 / len);

            if (m.userData.model) {
                const angle = Math.atan2(dir.y, dir.x);
                m.userData.model.rotation.y = angle + Math.PI / 2;
            }
        }

        const step = EnemyMovementSpeed * dt;
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
        const dynamicColliders = allowPlayerOverlap
            ? monsters
            : [player, ...monsters];
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

export function killMonster(monster) {
    if (!monster) return;

    const idx = monsters.indexOf(monster);
    if (idx !== -1) monsters.splice(idx, 1);

    monster.visible = false;
}
