import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { gsap } from 'gsap';

// Scene setup
const scene = new THREE.Scene();

// Camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 10;

// Renderer setup
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// OrbitControls for camera interactivity
const controls = new OrbitControls(camera, renderer.domElement);

// Materials
const grassMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const roadMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });
const rectangleMaterial = new THREE.MeshBasicMaterial({ color: 0xffa500 }); // Color for the 3D rectangle
const roundaboutMaterial = new THREE.MeshBasicMaterial({ color: 0x333333 }); // Darker color for the roundabout
const movingObjectMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff }); // Blue color for the 3D moving object


const grass = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), grassMaterial);
grass.rotation.x = -Math.PI / 2;
grass.position.y = -0.1;
scene.add(grass);

// Horizontal Road (Main road)
const horizontalRoad = new THREE.Mesh(new THREE.PlaneGeometry(12, 2), roadMaterial);
horizontalRoad.rotation.x = -Math.PI / 2;
horizontalRoad.position.set(0, 0, 0);
scene.add(horizontalRoad);

// 3D Rectangle at the Upper Side
const upperRectangle = new THREE.Mesh(new THREE.BoxGeometry(4, 2, 2), rectangleMaterial);
upperRectangle.position.set(0, 1, -3); // Raised above the road for visibility
scene.add(upperRectangle);

const exitPath = new THREE.Mesh(new THREE.PlaneGeometry(2, 6), roadMaterial);
exitPath.rotation.x = -Math.PI / 2;
exitPath.position.set(0, 0, -1);
scene.add(exitPath);

const extendedExitPath = new THREE.Mesh(new THREE.PlaneGeometry(2, 10), roadMaterial); // Longer exit path
extendedExitPath.rotation.x = -Math.PI / 2;
extendedExitPath.position.set(0, 0, 3);
scene.add(extendedExitPath);

// Small Roundabout at the Intersection
const roundabout = new THREE.Mesh(
    new THREE.CircleGeometry(1, 32),
    roundaboutMaterial
);
roundabout.rotation.x = -Math.PI / 2;
roundabout.position.set(0, 0.01, 0);
scene.add(roundabout);

// 3D Moving Object (Cylinder moving around the roundabout)
const movingObject = new THREE.Mesh(
    new THREE.CylinderGeometry(0.3, 0.3, 0.1, 32),
    movingObjectMaterial
);
movingObject.rotation.x = Math.PI / 2;
movingObject.position.set(-2, 0.1, -2);
scene.add(movingObject);

let angle = 0;
let pathPosition = -2;
const radius = 2;
const center = new THREE.Vector3(0, 0.1, 0);
let isCircling = false;
let isExiting = false;
let isExitingLeft = false;
let isExitingRight = false;

function animate() {
    requestAnimationFrame(animate);

    if (!isCircling && !isExiting) {
        if (pathPosition <= 2) {
            pathPosition += 0.1; // Move the object along the rectangle's exit path
            movingObject.position.x = pathPosition;
            movingObject.position.z = -2;
        }


        if (pathPosition >= 2) {
            isCircling = true;
        }
    }

    // If the object is moving in a circle around the roundabout
    if (isCircling) {
        angle += 0.02; // Increment the angle to move the object in a circle
        movingObject.position.x = center.x + Math.cos(angle) * radius;
        movingObject.position.z = center.z + Math.sin(angle) * radius;

        // Once the object completes the circular motion (after one full cycle)
        if (angle >= Math.PI * 2) {
            angle = 0; // Reset the angle
            isCircling = false; // Stop circular motion
            isExiting = true; // Set the flag to exit
        }
    }

    // Once the object completes the circular motion, start exiting through the opposite path (right path)
    if (isExiting) {
        pathPosition += 0.1; // Move the object along the right exit path
        movingObject.position.x = pathPosition;
        movingObject.position.z = 1.5; // Keep the height constant

        // Once the object has moved far enough, reset the cycle
        if (pathPosition >= 5) { // When it reaches the end of the extended path
            // Reset position for the next cycle
            pathPosition = -2; // Set it back to start at the rectangle
            movingObject.position.x = pathPosition;
            movingObject.position.z = 1.5;
            isExiting = false; // Stop exiting
            isCircling = true; // Start the circular motion again
        }
    }

    controls.update();
    renderer.render(scene, camera);
}

animate();


window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
