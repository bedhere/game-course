import * as THREE from 'three';

const CELL_SIZE = 100;
const GRID_SIZE = 20;
const BLOCK_HEIGHT = CELL_SIZE; // 1:1:1 cube
const MAX_ELEVATION = 3;

// ─── Load & composite Minecraft textures ─────────────────────

const imageLoader = new THREE.ImageLoader();

function loadImage(path) {
  return new Promise((resolve) => {
    imageLoader.load(path, resolve);
  });
}

function makeNearestTex(canvas) {
  const tex = new THREE.CanvasTexture(canvas);
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// Grass top: grayscale → tint green
async function loadGrassTop() {
  const img = await loadImage('/textures/grass_block_top.png');
  const c = document.createElement('canvas');
  c.width = img.width;
  c.height = img.height;
  const ctx = c.getContext('2d');
  ctx.drawImage(img, 0, 0);

  const d = ctx.getImageData(0, 0, c.width, c.height);
  for (let i = 0; i < d.data.length; i += 4) {
    d.data[i]     = Math.round(d.data[i] * 124 / 255);
    d.data[i + 1] = Math.round(d.data[i + 1] * 189 / 255);
    d.data[i + 2] = Math.round(d.data[i + 2] * 107 / 255);
  }
  ctx.putImageData(d, 0, 0);
  return makeNearestTex(c);
}

// Side: use grass_block_side directly (already green top + dirt bottom)
async function loadGrassSide() {
  const img = await loadImage('/textures/grass_block_side.png');
  const tex = new THREE.Texture(img);
  tex.needsUpdate = true;
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// Rotate image by angle (degrees) and return a canvas texture
function rotateImage(img, angle) {
  const c = document.createElement('canvas');
  const rad = (angle * Math.PI) / 180;
  const cos = Math.abs(Math.cos(rad));
  const sin = Math.abs(Math.sin(rad));
  c.width = Math.round(img.width * cos + img.height * sin);
  c.height = Math.round(img.width * sin + img.height * cos);
  const ctx = c.getContext('2d');
  ctx.translate(c.width / 2, c.height / 2);
  ctx.rotate(rad);
  ctx.drawImage(img, -img.width / 2, -img.height / 2);
  return makeNearestTex(c);
}

// Dirt: use as-is (already colored)
async function loadDirt() {
  const img = await loadImage('/textures/dirt.png');
  const tex = new THREE.Texture(img);
  tex.needsUpdate = true;
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// ─── Seeded random ───────────────────────────────────────────

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// ─── Build terrain ───────────────────────────────────────────

const mapGroup = new THREE.Group();

Promise.all([loadGrassTop(), loadGrassSide(), loadDirt()]).then(
  ([grassTopTex, grassSideTex, dirtTex]) => {
    const topMat = new THREE.MeshStandardMaterial({ map: grassTopTex });
    const bottomMat = new THREE.MeshStandardMaterial({ map: dirtTex });

    // BoxGeometry face order: [+X, -X, +Y, -Y, +Z, -Z]
    // +Z (top): 180° to put grass at top
    // +X: 90° CCW to put grass at +Z
    // -X (W方向): 180°
    // +Y/-Y: no rotation needed
    // -Z (D方向): 180°
    const sideNoRot = grassSideTex;                                           // +Y, -Y
    const sideRot180 = rotateImage(grassSideTex.image, 180);                 // +Z, -Z, -X
    const sideRot90  = rotateImage(grassSideTex.image, 90);// +X
    const sideRot270 = rotateImage(grassSideTex.image, 270);                 // +X

    const matPx = new THREE.MeshStandardMaterial({ map: sideRot270 });
    const matNx = new THREE.MeshStandardMaterial({ map: sideRot90 });
    const matPy = new THREE.MeshStandardMaterial({ map: sideRot180 });
    const matNy = new THREE.MeshStandardMaterial({ map: sideNoRot });
    const matPz = new THREE.MeshStandardMaterial({ map: sideRot180 });
    const matNz = new THREE.MeshStandardMaterial({ map: sideRot180 });

    const blockGeom = new THREE.BoxGeometry(CELL_SIZE, CELL_SIZE, BLOCK_HEIGHT);
    const rand = seededRandom(42);
    const half = GRID_SIZE / 2;

    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        const distFromCenter = Math.max(
          Math.abs(row - half + 0.5) / half,
          Math.abs(col - half + 0.5) / half
        );
        const maxH = Math.max(
          1,
          Math.round(MAX_ELEVATION * (1 - distFromCenter * 0.6))
        );
        const stackCount = 1 + Math.floor(rand() * maxH);

        for (let layer = 0; layer < stackCount; layer++) {
          const isTop = layer === stackCount - 1;
          const mats = [
            matPx,      // +X  (90° CCW)
            matNx,      // -X  (180°, W方向)
            matPy,      // +Y  (no rotation)
            matNy,      // -Y  (no rotation)
            isTop ? topMat : matPz,  // +Z (top, 180°)
            matNz,      // -Z  (180°, D方向)
          ];
          const block = new THREE.Mesh(blockGeom, mats);

          block.position.x = (col - half + 0.5) * CELL_SIZE;
          block.position.y = (row - half + 0.5) * CELL_SIZE;
          block.position.z =
            layer * BLOCK_HEIGHT -
            stackCount * BLOCK_HEIGHT +
            BLOCK_HEIGHT / 2;

          mapGroup.add(block);
        }
      }
    }
  }
);

export default mapGroup;
