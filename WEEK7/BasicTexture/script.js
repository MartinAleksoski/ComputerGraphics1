import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('textures/Stylized_Wood_Floor_001_basecolor.png');

// Create a cube with a textured material
const materialCube = new THREE.MeshBasicMaterial({ map: texture });
const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), materialCube);
scene.add(cube);

// Create a sphere with a basic material
const materialSphere = new THREE.MeshBasicMaterial({ map: texture }); // Green color
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), materialSphere);
sphere.position.x = 1.5; // Move the sphere to the side
scene.add(sphere);

// Render loop
function animate() {
    requestAnimationFrame(animate);
    cube.rotation.y += 0.01;
    sphere.rotation.y += 0.01; // Corrected animation for the sphere
    renderer.render(scene, camera);
}
animate();
