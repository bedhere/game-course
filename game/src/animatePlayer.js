import * as THREE from 'three';
import {movesQueue, player, stepCompleted} from './components/Player.js';
import { house } from './components/Map.js';
import { monsters } from './components/Monsters.js';
import { canOccupyPlayer } from './colliders.js';

const moveClock = new THREE.Clock(false);

export function animatePlayer() {
    if (!movesQueue.length) return;

    // Before starting a new animated step, do a tentative collision check
    if (!moveClock.running) {
        const dir = movesQueue[0];

        const startX = player.position.x;
        const startY = player.position.y;
        let endX = startX;
        let endY = startY;
        // Use the same step magnitude as Player.stepCompleted tentative check (±10)
        if (dir === 'left') endX -= 10;
        if (dir === 'right') endX += 10;
        if (dir === 'forward') endY += 10;
        if (dir === 'backward') endY -= 10;
        
        // Use shared occupancy logic
        const ok = canOccupyPlayer(player, endX, endY, { house, monsters });
        if (!ok) {
            // Cancel this move before animation begins
            movesQueue.shift();
            return;
        }
        const frog = player.userData.frog;
        if (frog) {
            if (!frog.userData.baseQuat) {
                frog.userData.baseQuat = frog.quaternion.clone();
            }

            let angle = 0;
            if (dir === 'left') angle = -Math.PI / 2;
            if (dir === 'right') angle =  Math.PI / 2;
            if (dir === 'forward') angle = Math.PI;
            if (dir === 'backward') angle = 0;

            const q = new THREE.Quaternion();
            q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), angle);

            frog.quaternion.copy(frog.userData.baseQuat).multiply(q);
        }

        moveClock.start();
    }

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

    if (movesQueue[0] === "left") endX -= 1;
    if (movesQueue[0] === "right") endX += 1;
    if (movesQueue[0] === "forward") endY += 1;
    if (movesQueue[0] === "backward") endY -= 1;

    player.position.x = THREE.MathUtils.lerp(startX, endX, progress);
    player.position.y = THREE.MathUtils.lerp(startY, endY, progress);
   const frog = player.userData.frog;
   if (frog) frog.position.z = Math.sin(progress * Math.PI) * 2;
}
