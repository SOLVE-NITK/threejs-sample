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
  deg,
  rad,
} from "./geometries.js";

// Global Variables
let scene, camera, renderer, controls;
let trans = new THREE.Vector3(250, 400, 0);
let transa = new THREE.Vector3(250, 250, 0);

let groupTrans = new THREE.Group();
let groupTransa = new THREE.Group();
let groupTransaa = new THREE.Group();

groupTrans.position.copy(trans);
groupTransa.position.copy(transa);
groupTransa.position.copy(transa);

let y = new THREE.Vector3(0, 0, 0);
let z = new THREE.Vector3(0, 0, 0);
let o = new THREE.Vector3(0, 0, 0);
let a = new THREE.Vector3(0, 0, 0);
let b = new THREE.Vector3(0, 0, 0);
let d = new THREE.Vector3(0, 0, 0);
let c = new THREE.Vector3(0, 0, 0);
let c1 = new THREE.Vector3(0, 0, 0);
let c2 = new THREE.Vector3(0, 0, 0);
let e = new THREE.Vector3(0, 0, 0);
let f = new THREE.Vector3(0, 0, 0);
let ii = new THREE.Vector3(0, 0, 0);
let k = new THREE.Vector3(0, 0, 0);
let l = new THREE.Vector3(0, 0, 0);
let v = new THREE.Vector3(0, 0, 0);
let va = new THREE.Vector3(0, 0, 0);

let pointA,
  pointB,
  lineOA,
  lineOB,
  lineZY,
  lineCD,
  lineCE,
  lineCF,
  lineCC1,
  lineCC2,
  pointE,
  pointF,
  lineEI2,
  lineK,
  lineI2K,
  lineDL,
  lineVVA;

let h1 = 0;
let om1 = 0;
let theta = 0;
let omega = 0;
let r = 0;
let h = 0;
let m = 4;
let m1 = 20;
let r1 = 0;
let g = 0;
let r2 = 0;
let r3 = 0;
let n = 130;
let simstatus = 0;
let rotstatus = 1;
let time = 0;
let mode = false;

// play pause
const playPauseButton = document.querySelector("#playpausebutton");
playPauseButton.addEventListener("click", simulationState);
const playPauseButtonImg = document.querySelector("#playpausebutton");

// scene mode button
const sceneMode = document.querySelector(".mode");
sceneMode.addEventListener("click", updateSceneMode);

function updateSceneMode() {
  mode = !mode;
  sceneMode.classList.toggle("mode-left");
  if (mode) {
    scene.background = new THREE.Color("#000000");
    sceneMode.textContent = "Light";
  } else {
    scene.background = new THREE.Color("#eeeeee");
    sceneMode.textContent = "Dark";
  }
}

let isAnimating = false;

function simulationState() {
  isAnimating = !isAnimating;
  if (isAnimating) {
    playPauseButtonImg.setAttribute("src", "./images/blueplaydull.svg");
    document.querySelector(".playPause").textContent = "Pause";
  }
  if (!isAnimating) {
    playPauseButtonImg.setAttribute("src", "./images/bluepausedull.svg");
    document.querySelector(".playPause").textContent = "Play";
  }
}

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
  varinit();
  drawInit();
  startAnimationLoop(); // Start the render loop

  // Add window resize listener
  window.addEventListener("resize", onWindowResize, false);
}

function onWindowResize() {
  const width = canvasContainer.clientWidth;
  const height = canvasContainer.clientHeight;
  // Update camera aspect ratio and projection matrix
  camera.left = 0;
  camera.right = width;
  camera.top = height;
  camera.bottom = 0;
  // Update the aspect ratio and camera projection matrix
  const aspectRatio = width / height;
  camera.aspect = aspectRatio;
  camera.updateProjectionMatrix();
  // Update renderer size
  renderer.setSize(width, height);
  // Optional: re-render the scene immediately
  renderer.render(scene, camera);
}

function setupScene() {
  scene = new THREE.Scene();
  // scene.background = new THREE.Color("#eeeeee");
  scene.background = new THREE.Color("#eeeeee");
  // scene.background = new THREE.Color("#000000");
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

  // camera.position.set(0, 0, 0); // Position the camera above the scene
  // camera.lookAt(0, 0, 0); // Point the camera downwards
  // camera.up.set(0, 0, -1); // Set the camera's up direction
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
  // Set the target to the center of your object or scene
  // controls.target.set(0, 0, 0);
  // Limit vertical rotation (up and down)
  // controls.minPolarAngle = -Math.PI / 4; // Prevent camera from going too far up
  // controls.maxPolarAngle = Math.PI / 4; // Prevent camera from going too far down

  // Optionally limit horizontal rotation (left and right)
  // controls.minAzimuthAngle = -Math.PI / 2; // Restrict rotation to the left
  // controls.maxAzimuthAngle = Math.PI / 4; // Restrict rotation to the right
  controls.enableDamping = true;
  controls.maxDistance = 50;
  controls.minDistance = 20;
  controls.update();
}

function setupLight() {
  const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(50, 25, 50);
  scene.add(directionalLight);

  const pointLight = new THREE.PointLight(0x104040, 0.6);
  pointLight.position.set(-10, 10, -10);
  scene.add(pointLight);

  const spotLight = new THREE.SpotLight(0xffffff, 1, 30, Math.PI * 0.1);
  spotLight.position.set(8, 4, 4);
  spotLight.target.position.set(0, -10, 0);
  scene.add(spotLight);
}

function startAnimationLoop() {
  // renderer.clear();
  // Clear groups before adding updated objects
  if (!isAnimating) {
    groupTrans.clear();
    groupTransa.clear();
    varupdate();
  }
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(startAnimationLoop);
}

init();

//start of simulation here; starts the timer with increments of 0.01 seconds
function startsim() {
  pauseTime = setInterval("varupdate();", "100");
  simstatus = 1;
}
// switches state of simulation between 0:Playing & 1:Paused
function simstate() {
  let imgfilename = document.getElementById("playpausebutton").src;
  imgfilename = imgfilename.substring(
    imgfilename.lastIndexOf("/") + 1,
    imgfilename.lastIndexOf(".")
  );
  if (imgfilename === "bluepausedull") {
    document.getElementById("playpausebutton").src =
      "./images/blueplaydull.svg";

    clearInterval(simTimeId);
    simstatus = 1;
    pauseTime = setInterval("varupdate();", "100");
    document.querySelector(".playPause").textContent = "Play";
  }
  if (imgfilename === "blueplaydull") {
    document.getElementById("playpausebutton").src =
      "./images/bluepausedull.svg";
    simstatus = 0;
    clearInterval(pauseTime);
    time = 0;
    simTimeId = setInterval("varupdate();time+=.01;", 10);
    document.querySelector(".playPause").textContent = "Pause";
  }
}

//Initialise system parameters here
function varinit() {
  varchange();
  //Variable slider and number input types
  $("#massSlider").slider("value", 25); // slider initialisation : jQuery widget
  $("#massSpinner").spinner("value", 25); // number initialisation : jQuery widget
  $("#nSlider").slider("value", 130);
  $("#nSpinner").spinner("value", 130);
}
function varchange() {
  $("#massSlider").slider({ max: 6, min: 2, step: 0.5 });
  $("#massSpinner").spinner({ max: 6, min: 2, step: 0.5 });

  $("#massSlider").on("slide", function (e, ui) {
    $("#massSpinner").spinner("value", ui.value);
    time = 0;
    varupdate();
  });
  $("#massSpinner").on("spin", function (e, ui) {
    $("#massSlider").slider("value", ui.value);
    time = 0;
    varupdate();
  });
  $("#massSpinner").on("change", function () {
    varchange();
  });

  $("#nSlider").slider({ max: 180, min: 130, step: 2 });
  $("#nSpinner").spinner({ max: 180, min: 130, step: 2 });

  $("#nSlider").on("slide", function (e, ui) {
    $("#nSpinner").spinner("value", ui.value);
    time = 0;
    varupdate();
  });
  $("#nSpinner").on("spin", function (e, ui) {
    $("#nSlider").slider("value", ui.value);
    time = 0;
    varupdate();
  });
  $("#nSpinner").on("change", function () {
    varchange();
  });
  $("#nSpinner").on("touch-start", function () {
    varchange();
  });
}
function varupdate() {
  $("#massSpinner").spinner("value", $("#massSlider").slider("value")); //updating slider location with change in spinner(debug)
  $("#nSpinner").spinner("value", $("#nSlider").slider("value"));
  n = $("#nSlider").slider("value");
  m = $("#massSlider").slider("value");
  omega = (2 * 3.14 * n) / 600;
  theta = theta + rotstatus * 0.05 * deg(omega);
  theta = theta % 360;
  if (theta < 0) theta += 360;
  a;
  h = ((m + m1) * 9.81) / (omega * omega * m);
  g = 80 * 80 - h * h;
  r1 = Math.sqrt(g);
  r2 = r1 * Math.cos(rad(theta));
  r3 = 10 * Math.cos(rad(theta));
  o.x = 0;
  o.y = 0;
  z.x = 10 * Math.cos(rad(theta));
  z.y = 10 * Math.sin(rad(theta));
  y.x = -10 * Math.cos(rad(theta));
  y.y = -10 * Math.sin(rad(theta));
  c.x = 0;
  c.y = 0;
  c1.x = 8 * Math.cos(rad(theta));
  c1.y = 0;
  c2.x = -8 * Math.cos(rad(theta));
  c2.y = 0;
  d.x = 0;
  e.x = r2;
  e.y = -h;
  f.x = -r2;
  f.y = -h;
  d.y = -2 * h;
  ii.x = r3;
  ii.y = -2 * h;
  k.x = -r3;
  k.y = -2 * h;
  l.x = 0;
  l.y = -2 * h - 30;
  v.x = r3;
  v.y = -2 * h - 30;
  va.x = -r3;
  va.y = -2 * h - 30;
  a.x = r1 * Math.cos(rad(theta));
  a.y = r1 * Math.sin(rad(theta));
  b.x = -r1 * Math.cos(rad(theta));
  b.y = -r1 * Math.sin(rad(theta));

  //update points
  updatePoints(pointA, a);
  updatePoints(pointB, b);
  updatePoints(pointE, e);
  updatePoints(pointF, f);

  // update lines
  updateLine(lineCC1, c, c1);
  updateLine(lineCC2, c, c2);
  updateLine(lineCD, c, d);
  updateLine(lineOB, o, b);
  updateLine(lineZY, z, y);
  updateLine(lineOA, o, a);
  updateLine(lineCE, c, e);
  updateLine(lineCF, c, f);
  updateLine(lineEI2, e, ii);
  updateLine(lineK, f, k);
  updateLine(lineI2K, ii, k);
  updateLine(lineDL, d, l);
  updateLine(lineVVA, v, va);
  groupTrans.add(pointA, pointB, lineOA, lineOB, lineZY);
  groupTransa.add(
    lineCD,
    lineCE,
    lineCF,
    lineCC1,
    lineCC2,
    pointE,
    pointF,
    lineEI2,
    lineK,
    lineI2K,
    lineDL,
    lineVVA
  );
  scene.add(groupTrans, groupTransa);
}

function drawInit() {
  // Your drawing logic here
  // Group Trans
  pointA = drawSphere(a, m + 7, 0x0000f0);
  pointB = drawSphere(b, m + 7, 0x0000f0);
  lineOA = drawLine(o, a, 0x220000, 5);
  lineOB = drawLine(o, b, 0x220000, 5);
  lineZY = drawLine(z, y, 0x000000, 15);

  // Group TransA
  lineCD = drawLine(c, d, "#181819", 5);
  lineCE = drawLine(c, e, "#0885d8", 5);
  lineCF = drawLine(c, f, "#0885d8", 5);
  lineCC1 = drawLine(c, c1, "#181819", 15);
  lineCC2 = drawLine(c, c2, "#181819", 15);

  pointE = drawSphere(e, m + 7, 0x0000f0);
  pointF = drawSphere(f, m + 7, 0x0000f0);
  lineEI2 = drawLine(e, ii, "#0885d8", 5);
  lineK = drawLine(f, k, "#0885d8", 5);
  lineI2K = drawLine(ii, k, "#e5791b", 20);
  lineDL = drawLine(d, l, "#e5791b", 10);
  lineVVA = drawLine(v, va, "#e5791b", 10);
}

function updatePoints(point, pt) {
  point.position.copy(pt);
}
function updateLine(line, a, b) {
  // Update the points array with new positions
  const points = [a.x, a.y, a.z, b.x, b.y, b.z];
  // Update the geometry positions
  line.geometry.setPositions(points);
}

window.addEventListener("load", init);
