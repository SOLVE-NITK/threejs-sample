import * as THREE from "three";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.167.1/examples/jsm/controls/OrbitControls.js";
import {
  drawLine,
  drawSphere,
  drawCube,
  drawBezierCurve,
  createSpring,
  drawPlane,
  drawCylinder,
} from "./geometries.js";

import { draw } from "./script.js";

// Global Variables
let scene, camera, renderer, controls;

// canvas container
const canvasContainer = document.querySelector("#canvas-container");

/********
 * Set up of scene
 * Set up of camera
 * Set up of renderer
 * Set up of controls
 * Set up of light
 * animation loop
 * ****/

function init() {
  setupScene();
  setupCamera();
  setupRenderer();
  setupControls();
  setupLight();
  draw(); // Draw objects onto the scene
  startAnimationLoop(); // Start the render loop
}

function setupScene() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color("#ffffff");
}

function setupCamera() {
  const aspectRatio =
    canvasContainer.clientWidth / canvasContainer.clientHeight;
  camera = new THREE.OrthographicCamera(0, 500, 500, 0, -1000, 1000);
  camera.aspect = aspectRatio;
  camera.updateProjectionMatrix();
  camera.position.set(
    0,
    -canvasContainer.clientHeight / 2,
    Math.max(canvasContainer.clientWidth, canvasContainer.clientHeight) / 2
  );
  camera.lookAt(0, -canvasContainer.clientHeight / 2, 0);
}

function setupRenderer() {
  renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#canvas"),
    antialias: true,
  });
  renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

function setupControls() {
  controls = new OrbitControls(
    camera,
    document.querySelector("#canvas-container")
  );
  controls.enableDamping = true;
  controls.maxDistance = 30;
  controls.minDistance = 20;
}

function setupLight() {
  const directionalLight = new THREE.DirectionalLight(0xff0000, 0.8);
  directionalLight.position.set(3, 1, 15);
  scene.add(directionalLight);

  const pointLight = new THREE.PointLight(0x00ff00, 0.6);
  pointLight.position.set(-3, 3, -3);
  scene.add(pointLight);

  const spotLight = new THREE.SpotLight(0x0000ff, 1, 30, Math.PI * 0.1);
  spotLight.position.set(8, 4, 4);
  spotLight.target.position.set(0, -1, 0);
  scene.add(spotLight);
}

function startAnimationLoop() {
  requestAnimationFrame(startAnimationLoop);
  controls.update();
  renderer.render(scene, camera);
}

init();
