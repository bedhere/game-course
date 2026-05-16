import * as THREE from 'three';

const TILE_SIZE = 100;
const GRID_SIZE = 20; // 20 × 20 tiles = 2000 × 2000 total
const COLOR_DARK = 0x228B22;
const COLOR_LIGHT = 0x90EE90;

const mapGroup = new THREE.Group();

const tileGeom = new THREE.PlaneGeometry(TILE_SIZE, TILE_SIZE);
const darkMat = new THREE.MeshStandardMaterial({ color: COLOR_DARK });
const lightMat = new THREE.MeshStandardMaterial({ color: COLOR_LIGHT });

const half = GRID_SIZE / 2;

for (let row = 0; row < GRID_SIZE; row++) {
  for (let col = 0; col < GRID_SIZE; col++) {
    const isDark = (row + col) % 2 === 0;
    const tile = new THREE.Mesh(tileGeom, isDark ? darkMat : lightMat);
    tile.position.x = (col - half + 0.5) * TILE_SIZE;
    tile.position.y = (row - half + 0.5) * TILE_SIZE;
    tile.position.z = -0.1;
    mapGroup.add(tile);
  }
}

export default mapGroup;
