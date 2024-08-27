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
// Define parameters for the harmonic motion
const amplitude = 10; // Amplitude of the motion
const k = 1; // Spring constant
const m = 1; // Mass
const omega = Math.sqrt(k / m); // Angular frequency
const a = new THREE.Vector3(-15, 0, 0);
const b = new THREE.Vector3(15, 0, 0);
const c = new THREE.Vector3(15, 0, 0);
let sphereA, sphereB, lineAC, groupAB, springAB;
const scene = new THREE.Scene();
// const camera = new THREE.OrthographicCamera(-50, 50, 50, -50, 0.1, 1000);
const camera = new THREE.PerspectiveCamera(
  10,
  window.innerWidth / window.innerHeight,
  10,
  4000
);
const canvas = document.querySelector("canvas.threejs");
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
const controls = new OrbitControls(camera, canvas);

// initialize pane
// const pane = new Pane();

// initialize the scene
function initializeScene() {
  scene.background = new THREE.Color("#ffe8cc");
}

// set up Light
function setUpLight() {
  //addLights
  const pointLight = new THREE.PointLight(0xffffff, 2);
  scene.add(pointLight);
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
  scene.add(ambientLight);
}

// initialize camera
function initializeCamera() {
  // initialize the camera
  camera.position.set(0, -400, 400); // Adjust as necessary
  camera.lookAt(0, -400, 400); // Ensure the camera is looking at the origin
}
// const axesHelper = new THREE.AxesHelper(5);
// setup axes helper
function setupAxesHelper() {
  const axesHelper = new THREE.AxesHelper(5); // Length of the axes lines
  scene.add(axesHelper);
}

// initialize renderer
function initializeRenderer() {
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

// add controls
function addControls() {
  // add controls
  controls.enableDamping = true;
  controls.maxDistance = 200;
  controls.minDistance = 20;
}

// add resize listener
window.addEventListener("resize", () => {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
});
let time = 0;
let deg = 0;
// render loop
const renderloop = () => {
  // Calculate the new position based on the sine function
  const x = amplitude * Math.sin(omega * time);
  const y = amplitude * Math.cos(omega * time);

  time += 0.1;
  // deg += 1;
  // if (deg == 360) deg = 0;
  // Update the mass position
  b.x = x;
  // b.y = y;

  sphereA.position.copy(a);
  sphereB.position.copy(b);
  // updateLine(lineAB, a, b);
  updateSpring(springAB, a, b, 60);

  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(renderloop);
};

function init() {
  initializeScene();
  setUpLight();
  initializeCamera();
  // setupAxesHelper();
  initializeRenderer();
  // addControls();
  draw();
  renderloop();
}
function draw() {
  sphereA = drawCylinder(a, 1);
  sphereB = drawCube(b, 1);
  lineAC = drawLine(a, c);
  springAB = createSpring(0.5, 10, 15, 2000, 0.08); // Initial height is arbitrary; will be adjusted dynamically
  groupAB = new THREE.Group();
  groupAB.add(springAB, sphereA, sphereB, lineAC);
  scene.add(groupAB);
}

init();
// renderloop();

function updateLine(line, a, b) {
  // Update the points array with new positions
  const points = [a.x, a.y, a.z, b.x, b.y, b.z];

  // Update the geometry positions
  line.geometry.setPositions(points);
}

// update spring

function updateSpring(spring, a, b, additionalAngle = 0) {
  const angleInRadians = THREE.MathUtils.degToRad(additionalAngle);

  // Calculate direction and distance between points a and b
  const direction = new THREE.Vector3().subVectors(b, a);
  const distance = direction.length();
  direction.normalize();

  // Calculate the midpoint between a and b
  const midpoint = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5);

  // Align the spring along the direction vector
  const axis = new THREE.Vector3(0, 1, 0); // Assuming the spring's default orientation is along the Y-axis
  const quaternion = new THREE.Quaternion().setFromUnitVectors(axis, direction);

  // Apply additional rotation around the direction vector
  spring.setRotationFromQuaternion(quaternion);
  spring.rotateOnAxis(direction, angleInRadians);

  // Position the spring at the midpoint and scale it to match the distance
  spring.position.copy(a);
  spring.scale.set(1, distance / 10, 1); // Adjust the scale factor for Y-axis as needed

  // Calculate the new position of b after rotation
  const rotatedDirection = new THREE.Vector3(0, distance, 0).applyQuaternion(
    spring.quaternion
  );
  const newBPosition = a.clone().add(rotatedDirection);

  // Update the sphere's position representing point b
  sphereB.position.copy(newBPosition);
}
