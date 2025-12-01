import * as THREE from 'three';
import {Camera} from "./components/Camera.js";
import {Renderer} from "./components/Renderer.js";
import {player} from "./components/Player.js";
import {map, initMap} from "./components/Map.js";
import './style.css';
import './collectUserInput.js';
import {animatePlayer} from './animatePlayer.js'

const scene = new THREE.Scene();
scene.add(player);
scene.add(map)

const ambientLight = new THREE.AmbientLight();
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight();
dirLight.position.set(-100, -100, 200);
scene.add(dirLight);

const camera = Camera();
player.add(camera);

await initMap();

const renderer = Renderer();
renderer.setAnimationLoop(animate);

function animate() {
    animatePlayer();
    renderer.render(scene, camera);
}


