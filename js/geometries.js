import * as THREE from "three";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.167.1/examples/jsm/controls/OrbitControls.js";
import { Line2 } from "https://cdn.jsdelivr.net/npm/three@0.167.1/examples/jsm/lines/Line2.js";
import { LineMaterial } from "https://cdn.jsdelivr.net/npm/three@0.167.1/examples/jsm/lines/LineMaterial.js";
import { LineGeometry } from "https://cdn.jsdelivr.net/npm/three@0.167.1/examples/jsm/lines/LineGeometry.js";
export function drawLine(a, b, color = 0x0000ff, linewidth = 6) {
  const lineGeometry = new LineGeometry();
  lineGeometry.setPositions([a.x, a.y, a.z, b.x, b.y, b.z]);
  const lineMaterial = new LineMaterial({ color, linewidth });
  const line = new Line2(lineGeometry, lineMaterial);
  line.computeLineDistances();
  return line;
}

export function drawSphere(point, scaleValue = 1, color) {
  const sphereGeometry = new THREE.SphereGeometry(1, 32, 16);
  const sphereMaterial = new THREE.MeshStandardMaterial({
    color: color,
    metalness: 0.4, // Set the metalness (0.0 - 1.0)
    roughness: 0.1, // Set the roughness (0.0 - 1.0)
  });
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphere.position.copy(point);
  sphere.scale.setScalar(scaleValue);
  return sphere;
}

export function drawCylinder(point, scaleValue, color) {
  const geometry = new THREE.CylinderGeometry(1, 2, 2, 32);
  const material = new THREE.MeshStandardMaterial({
    color: "maroon",
    metalness: 0.8, // Set the metalness (0.0 - 1.0)
    roughness: 0.3, // Set the roughness (0.0 - 1.0)
  });
  const cylinder = new THREE.Mesh(geometry, material);
  // scene.add(cylinder);
  // const sphereGeometry = new THREE.SphereGeometry(
  //   1,
  //   32 * scaleValue,
  //   16 * scaleValue
  // );
  // const sphereMaterial = new THREE.MeshPhongMaterial({ color: color });
  // const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  // Assign the point's position to the sphere's position
  cylinder.position.set(point.x, point.y, point.z);
  cylinder.scale.setScalar(scaleValue);
  return cylinder;
}

export function drawCube(point, scaleValue) {
  const cubeGemoetry = new THREE.BoxGeometry(1, 1, 1, 1);
  const cubeMaterial = new THREE.MeshBasicMaterial({ color: "goldenrod" });
  const cube = new THREE.Mesh(cubeGemoetry, cubeMaterial);

  // Assign the point's position to the sphere's position
  cube.position.set(point.x, point.y, point.z);
  cube.scale.setScalar(2 * scaleValue);
  // Add the cube to the scene
  return cube;
}

export function drawBezierCurve(a, b, c, d) {
  // Define points for the cubic Bezier curve
  const startPoint = new THREE.Vector3(-10, 0, 0); // Start point
  const controlPoint1 = new THREE.Vector3(-5, 15, 0); // First control point
  const controlPoint2 = new THREE.Vector3(30, 15, 0); // Second control point
  const endPoint = new THREE.Vector3(50, 0, 0); // End point

  // Create the cubic Bezier curve
  const curve = new THREE.CubicBezierCurve3(a, b, c, d);

  // Get points along the curve
  const points = curve.getPoints(50); // Increase number for smoother curve

  // Create geometry from points
  const lineGeometry = new LineGeometry();

  // Or use .flat() method if supported
  const flattenedPoints = points.map((p) => [p.x, p.y, p.z]).flat();
  lineGeometry.setPositions(flattenedPoints); // Use flat array for positions

  // Create material for the line
  const lineMaterial = new LineMaterial({
    color: 0xff0000, // Red color
    linewidth: 2, // Line thickness (relative to screen)
    worldUnits: true,
  });

  // Create the line object
  const line = new Line2(lineGeometry, lineMaterial);
  line.computeLineDistances();

  // Add the line to the scene
  return line;
}

// spring
// Custom Helix Curve
class HelixCurve extends THREE.Curve {
  constructor(radius, height, turns) {
    super();
    this.radius = radius;
    this.height = height;
    this.turns = turns;
  }

  getPoint(t) {
    const angle = 2 * Math.PI * this.turns * t;
    const x = this.radius * Math.cos(angle);
    const y = this.height * t;
    const z = this.radius * Math.sin(angle);
    return new THREE.Vector3(x, y, z);
  }
}

export function createSpring(
  radius,
  height,
  turns,
  tubularSegments,
  tubeRadius
) {
  const helixCurve = new HelixCurve(radius, height, turns);

  // TubeGeometry along the Helix Curve
  const springGeometry = new THREE.TubeGeometry(
    helixCurve,
    tubularSegments, // Number of segments along the curve
    tubeRadius, // Radius of the tube forming the spring
    8, // Number of radial segments around the tube
    false // Closed or not
  );

  // Material for the spring
  const springMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

  // Mesh combining geometry and material
  const spring = new THREE.Mesh(springGeometry, springMaterial);
  return spring;
}

// plane
export function drawPlane(point, scaleValue, color) {
  const geometry = new THREE.PlaneGeometry(1, 1);
  const material = new THREE.MeshBasicMaterial({
    color: color,
    side: THREE.DoubleSide,
  });
  const plane = new THREE.Mesh(geometry, material);
  plane.scale.setScalar(scaleValue);
  plane.position.set(point.x, point.y, point.z);
  return plane;
}

//function to convert radians to degrees
export function deg(vrad) {
  return (vrad * 180) / Math.PI;
}
//function to convert degrees to radians
export function rad(vdeg) {
  return (vdeg * Math.PI) / 180;
}
