import * as THREE from 'three';
import { house } from './Map.js';
import { monsters } from './Monsters.js';
import { canOccupyPlayer } from '../colliders.js';

// Create a player group with a child mesh (body) so animatePlayer can access children[0]
export const player = new THREE.Group();

(function initPlayer() {
    const body = new THREE.Mesh(
        new THREE.BoxGeometry(15, 15, 20),
        new THREE.MeshLambertMaterial({
            color: 'white',
            flatShading: true,
        })
    );
    body.position.z = 0;
    player.add(body);

    // Initial position
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

    // Keep stepCompleted consistent with animatePlayer.setPosition axes:
    // left/right -> x, forward/backward -> y
    let nextX = player.position.x;
    let nextY = player.position.y;
    if (direction === 'left') nextX -= 10;
    if (direction === 'right') nextX += 10;
    if (direction === 'forward') nextY += 10;
    if (direction === 'backward') nextY -= 10;

    // Use shared occupancy logic; only commit if allowed
    const ok = canOccupyPlayer(player, nextX, nextY, { house, monsters });
    if (!ok) {
        return;
    }
    player.position.x = nextX;
    player.position.y = nextY;
}