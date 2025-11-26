import * as THREE from 'three';
import {movesQueue, player, stepCompleted} from './components/Player.js';

const moveClock = new THREE.Clock(false);

export function animatePlayer() {
    if (!movesQueue.length) return;

    if (!moveClock.running) moveClock.start();

    const stepTime = 0.2; // Seconds it takes to take a step
    const progress = Math.min(1, moveClock.getElapsedTime() / stepTime);

    setPosition(progress);

    // Once a step has ended
    if (progress >= 1) {
        stepCompleted();
        moveClock.stop();
    }
}

function setPosition(progress) {
    const startX = player.position.x
    const startY = player.position.y
    let endX = startX;
    let endY = startY;

    if (movesQueue[0] === "left") endX -= 10;
    if (movesQueue[0] === "right") endX += 10;
    if (movesQueue[0] === "forward") endY += 10;
    if (movesQueue[0] === "backward") endY -= 10;

    player.position.x = THREE.MathUtils.lerp(startX, endX, progress);
    player.position.y = THREE.MathUtils.lerp(startY, endY, progress);
    player.children[0].position.z = Math.sin(progress * Math.PI) * 8;
}
