import * as THREE from 'three';

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
    body.position.z = 10;
    player.add(body);

    // Initial position
    player.position.set(0, 0, 0);
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
    if (direction === 'left') player.position.x -= 10;
    if (direction === 'right') player.position.x += 10;
    if (direction === 'forward') player.position.y += 10;
    if (direction === 'backward') player.position.y -= 10;
}