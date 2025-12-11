import * as THREE from 'three';
import { loadHouses } from './Houses.js';

export const map = new THREE.Group();
export let houses = [];
let bounds = null;

export async function initMap() {
    const squareSize = 30;
    const boardSize = 20;

    // const geometry = new THREE.PlaneGeometry(squareSize * boardSize, squareSize * boardSize);
    // const material = new THREE.MeshLambertMaterial({ color: '#000000' });
    // const mesh = new THREE.Mesh(geometry, material);
    // map.add(mesh);


    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            const geometry = new THREE.PlaneGeometry(squareSize, squareSize);

            // Alternate between green and light green
            const isEven = (row + col) % 2 === 0;
            const color = isEven ? '#228B22' : '#90EE90'; // Dark green and light green
            const material = new THREE.MeshLambertMaterial({ color: color });

            const square = new THREE.Mesh(geometry, material);

            // Position each square
            const xPos = col * squareSize - (boardSize * squareSize) / 2 + squareSize / 2;
            const yPos = row * squareSize - (boardSize * squareSize) / 2 + squareSize / 2;

           // square.rotation.x = -Math.PI / 2; // lay flat if needed for Z-up camera
            square.position.set(xPos, yPos, 0);
            map.add(square);
        }
    }

    // cache bounds once based on board
    const half = (boardSize * squareSize) / 2;
    bounds = { minX: -half, maxX: half, minY: -half, maxY: half, squareSize, boardSize };

    try {
        houses = await loadHouses();
        for (const h of houses) {
            map.add(h);
        }
    } catch (e) {
        console.error('Failed to load house models', e);
    }
}

export function getMapBounds() {
    if (bounds) return bounds;
    // Fallback if called too early
    const squareSize = 30;
    const boardSize = 20;
    const half = (boardSize * squareSize) / 2;
    return { minX: -half, maxX: half, minY: -half, maxY: half, squareSize, boardSize };
}