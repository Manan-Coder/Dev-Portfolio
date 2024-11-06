import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
import { gsap } from "https://cdn.skypack.dev/gsap";

const camera = new THREE.PerspectiveCamera(
  10,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 13;

const scene = new THREE.Scene();


let robot, drone;
let mixerRobot, mixerDrone;


const loader = new GLTFLoader();
loader.load(
  "mech_drone.glb",
  function (gltf) {
    robot = gltf.scene;
    scene.add(robot);
    mixerRobot = new THREE.AnimationMixer(robot);
    mixerRobot.clipAction(gltf.animations[0]).play();
    modelMove();
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  function (error) {
    console.error("An error occurred loading the mech_drone model", error);
  }
);

loader.load(
  "/buster_drone.glb",
  function (gltf) {
    drone = gltf.scene;

    mixerDrone = new THREE.AnimationMixer(drone);
    mixerDrone.clipAction(gltf.animations[0]).play();
    modelMove();
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  function (error) {
    console.error("An error occurred loading the buster_drone model", error);
  }
);


const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("container3D").appendChild(renderer.domElement);


const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const topLight = new THREE.DirectionalLight(0xffffff, 1);
topLight.position.set(500, 500, 500);
scene.add(topLight);


const clock = new THREE.Clock();
const reRender3D = () => {
  requestAnimationFrame(reRender3D);
  const delta = clock.getDelta(); 
  renderer.render(scene, camera);
  if (mixerRobot) mixerRobot.update(delta);
  if (mixerDrone) mixerDrone.update(delta);
};
reRender3D();


const arrPositionModel = [
  {
    id: "banner",
    position: { x: 0.85, y: -0.15, z: 7 },
    rotation: { x: 0, y: 2.9, z: -0.1 },
  },
  {
    id: "intro",
    position: { x: -0.5, y: -0.15, z: 6 },
    rotation: { x: 0, y: 4.5, z: -0.1 },
  },
  {
    id: "description",
    position: { x: 0.5, y: -0.3, z: 7 },
    rotation: { x: 0, y: 2.9, z: -0.1 },
  },
  {
    id: "contact",
    position: { x: 0.85, y: -0.15, z: 7 },
    rotation: { x: 0, y: 2, z: -0.1 },
  },
];


const modelMove = () => {
  if (!robot) return; 
  const sections = document.querySelectorAll(".section");
  let currentSection;

  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= window.innerHeight / 3) {
      currentSection = section.id;
    }
  });

  let position_active = arrPositionModel.findIndex(
    (val) => val.id == currentSection
  );

  if (position_active >= 0) {
    let new_coordinates = arrPositionModel[position_active];
    gsap.to(robot.position, {
      x: new_coordinates.position.x,
      y: new_coordinates.position.y,
      z: new_coordinates.position.z,
      duration: 3,
      ease: "power1.out",
    });
    gsap.to(robot.rotation, {
      x: new_coordinates.rotation.x,
      y: new_coordinates.rotation.y,
      z: new_coordinates.rotation.z,
      duration: 3,
      ease: "power1.out",
    });
  }
};


let lastScrollTime = 0;
window.addEventListener("scroll", () => {
  const now = Date.now();
  if (now - lastScrollTime > 200) {
 
    if (robot) {
      modelMove();
    }
    lastScrollTime = now;
  }
});


window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
