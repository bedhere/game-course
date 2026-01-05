import * as THREE from "three";

export function Camera() {
    const viewRatio = window.innerWidth / window.innerHeight;

    const camera = new THREE.PerspectiveCamera(
        30, // fov
        viewRatio, // aspect
        100, // near
        9000 // far
    );

    camera.up.set(0, 0, 1);
    camera.position.set(300, -300, 300);
    camera.lookAt(0, 0, 0);

    return camera;
}