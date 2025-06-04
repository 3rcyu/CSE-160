//City Pack by J-Toastie [CC-BY] via Poly Pizza

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.18/+esm';
import { MinMaxGUIHelper } from './gui.js';

let cubes = [];

const scene = new THREE.Scene();

const fov = 45;
const aspect = 2;  // the canvas default
const near = 0.1;
const far = 100;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(0, 10, 20);
//camera.position.z = 10;
const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas,
    logarithmicDepthBuffer: true,
    alpha: true,
  });
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 5, 0);
controls.update();

// Create a global audio listener
const listener = new THREE.AudioListener();
camera.add(listener); // Attach to camera so you hear from camera's perspective

const light = new THREE.DirectionalLight(0xFFFFFF, 3);
light.position.set(-1, 10, 4);
scene.add(light);

const geometry = new THREE.BoxGeometry(1, 1, 1);

function makeInstance(geometry, color, x) {
    const material = new THREE.MeshPhongMaterial({color});
    const cube = new THREE.Mesh(geometry, material);
    cube.position.x = x;
    scene.add(cube);
    return cube;
}

function updateCamera() {
    camera.updateProjectionMatrix();
}
   
const gui = new GUI();
gui.add(camera, 'fov', 1, 180).onChange(updateCamera);
const minMaxGUIHelper = new MinMaxGUIHelper(camera, 'near', 'far', 0.1);
gui.add(minMaxGUIHelper, 'min', 0.1, 50, 0.1).name('near').onChange(updateCamera);
gui.add(minMaxGUIHelper, 'max', 0.1, 50, 0.1).name('far').onChange(updateCamera);

// Load GLB model
const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/'); // Use CDN decoder
loader.setDRACOLoader(dracoLoader);

loader.load(
    'City Pack/Building Red.glb',
    function (gltf) {
      const rBuilding = gltf.scene;
      rBuilding.scale.set(2,2,2);
      rBuilding.position.set(15,0,11);
      rBuilding.rotation.y = -Math.PI / 2;
      scene.add(gltf.scene);
    },
    xhr => console.log((xhr.loaded / xhr.total * 100) + '% loaded'),
    err => console.error('An error happened loading the GLB:', err)
  );


loader.load(
    'City Pack/Brown Building.glb',
    function (gltf) {
        const bBuilding = gltf.scene;
        bBuilding.scale.set(2,2,2);
        bBuilding.position.set(15,0,6.75);
        bBuilding.rotation.y = -Math.PI / 2;
        scene.add(gltf.scene);
    },
    xhr => console.log((xhr.loaded / xhr.total * 100) + '% loaded'),
    err => console.error('An error happened loading the GLB:', err)
);

loader.load(
    'City Pack/Building Green.glb',
    function (gltf) {
        const gBuilding = gltf.scene;
        gBuilding.scale.set(2,2,2);
        gBuilding.position.set(15,0,2);
        gBuilding.rotation.y = -Math.PI / 2;
        scene.add(gltf.scene);
        for(let i=0; i<3; i++){
            let inst = gBuilding.clone();
            inst.position.set(5*i,0,15);
            inst.rotation.y = -Math.PI;
            scene.add(inst);
        }
        for(let i=0; i<3; i++){
            let inst = gBuilding.clone();
            inst.position.set(-5*i,0,15);
            inst.rotation.y = -Math.PI;
            scene.add(inst);
        }

        for(let i=0; i<3; i++){
            let inst = gBuilding.clone();
            inst.position.set(5*i,0,-15);
            inst.rotation.y = Math.PI*2;
            scene.add(inst);
        }
        for(let i=0; i<3; i++){
            let inst = gBuilding.clone();
            inst.position.set(-5*i,0,-15);
            inst.rotation.y = Math.PI*2;
            scene.add(inst);
        }
        
    },

    xhr => console.log((xhr.loaded / xhr.total * 100) + '% loaded'),
    err => console.error('An error happened loading the GLB:', err)

);



loader.load(
    'City Pack/Tree.glb',
    function (gltf) {
      const tree = gltf.scene;
      tree.scale.set(0.01,0.01,0.01);
      tree.position.set(3,0,4);
      scene.add(gltf.scene);
    },
    xhr => console.log((xhr.loaded / xhr.total * 100) + '% loaded'),
    err => console.error('An error happened loading the GLB:', err)
  );

let carModel = null;
const roadPath = [];  // will store all tile center positions
let currentPathIndex = 0;
const carSpeed = 7;


loader.load(
  'Sports Car-Gzj704DXdr.glb',
  function (gltf) {
    carModel = gltf.scene;
    carModel.scale.set(0.25, 0.25, 0.25);  
    carModel.position.set(0, 0.5, 0);     // Position 
    scene.add(gltf.scene);
  },
  xhr => console.log((xhr.loaded / xhr.total * 100) + '% loaded'),
  err => console.error('An error happened loading the GLB:', err)
);

let redLight, blueLight;
let policeModel = null;
const audioLoader = new THREE.AudioLoader();
loader.load(
    'City Pack/Police Car.glb',
    function (gltf) {
      policeModel = gltf.scene;
      policeModel.scale.set(0.35, 0.35, 0.35);  // Scale 
      policeModel.position.set(0, 0.5, 30);     // Position 

        // Create red and blue lights
        redLight = new THREE.PointLight(0xff0000, 1, 5);
        blueLight = new THREE.PointLight(0x0000ff, 1, 5);

        // Position lights on top of the car 
        redLight.position.set(-0.3, 2, 0);
        blueLight.position.set(0.3, 2, 0);

        // Attach to police car
        policeModel.add(redLight);
        policeModel.add(blueLight);
        // Create positional audio and attach to police car
        const sirenSound = new THREE.PositionalAudio(listener);

        // Load the siren sound and play it
        audioLoader.load('siren.mp3', function(buffer) {
        sirenSound.setBuffer(buffer);
        sirenSound.setLoop(true);
        sirenSound.setRefDistance(10);
        sirenSound.setVolume(0.05);
        sirenSound.play();
        });

        policeModel.add(sirenSound);

        scene.add(policeModel);
    },
    xhr => console.log((xhr.loaded / xhr.total * 100) + '% loaded'),
    err => console.error('An error happened loading the GLB:', err)
  );


loader.load(
    'City Pack/Road Bits.glb',
    function (gltf) {
      const roadRoot = gltf.scene.getObjectByName('RootNode');
      if (!roadRoot) return console.warn('RootNode not found');
  
      // Extract tiles by name
      const getTile = name => roadRoot.children.find(c => c.name === name);
      const tileStraight = getTile('road_straight');
      const tileCorner = getTile('road_corner');
      const tileTSplit = getTile('road_tsplit');
  
      if (!tileStraight || !tileCorner || !tileTSplit) {
        return console.error('One or more road tiles not found.');
      }
  
      const tileLength = 2;
      let pos = new THREE.Vector3(4, 0, -12);
      let dir = new THREE.Vector3(1, 0, 0); // +X direction
  
      function placeTile(base, position, angleZ = 0) {
        const tile = base.clone(true);
        tile.position.copy(position);
      
        if (angleZ !== 0) {
          tile.rotation.z = angleZ;
        }

        scene.add(tile);


        // Save this tile center to path for the car
        const pathPoint = position.clone().setY(0.5); // car height level
        roadPath.push(pathPoint);
      }
      
      
  
    // ➡️ Straight tiles
    for (let i = 0; i < 4; i++) {
        placeTile(tileStraight, pos.clone(),Math.PI / 2);
        pos.add(dir.clone().multiplyScalar(tileLength));
    }
    
    // ↱ Right turn — rotated 90° around Z axis
    placeTile(tileCorner, pos.clone(), -Math.PI / 2);
    dir.set(0, 0, 1); // update direction to +Z
    pos.add(dir.clone().multiplyScalar(tileLength));
    
    //More straight tiles
    for (let i = 0; i < 11; i++) {
        placeTile(tileStraight, pos.clone());
        pos.add(dir.clone().multiplyScalar(tileLength));
    }

    // ↱ Right turn — rotated 90° around Z axis
    placeTile(tileCorner, pos.clone(), Math.PI);
    dir.set(-1, 0, 0); // update direction to +Z
    pos.add(dir.clone().multiplyScalar(tileLength));

    //More straight tiles
    for (let i = 0; i < 11; i++) {
        placeTile(tileStraight, pos.clone(),Math.PI / 2);
        pos.add(dir.clone().multiplyScalar(tileLength));
    }

    // ↱ Right turn — rotated 90° around Z axis
    placeTile(tileCorner, pos.clone(), Math.PI/2);
    dir.set(0, 0, -1); // update direction to +Z
    pos.add(dir.clone().multiplyScalar(tileLength));

    // ⬇️ More straight tiles
    for (let i = 0; i < 11; i++) {
        placeTile(tileStraight, pos.clone(),Math.PI);
        pos.add(dir.clone().multiplyScalar(tileLength));
    }

    // ↱ Right turn — rotated 90° around Z axis
    placeTile(tileCorner, pos.clone(), -Math.PI*2);
    dir.set(1, 0, 0); // update direction to +Z
    pos.add(dir.clone().multiplyScalar(tileLength));

    // ⬇️ More straight tiles
    for (let i = 0; i < 7; i++) {
        placeTile(tileStraight, pos.clone(),Math.PI/2);
        pos.add(dir.clone().multiplyScalar(tileLength));
    }
  
      // T-split
      //placeTile(tileTSplit, pos.clone(), Math.PI / 2);
    },
    xhr => console.log(`Road bits loaded: ${xhr.loaded / xhr.total * 100}%`),
    err => console.error('Error loading road bits:', err)
  );
  


const planeSize = 30;
     
const tloader = new THREE.TextureLoader();
const texture = tloader.load('checker.png');
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.magFilter = THREE.NearestFilter;
texture.colorSpace = THREE.SRGBColorSpace;
const repeats = planeSize / 2;
texture.repeat.set(repeats, repeats);

const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
const planeMat = new THREE.MeshPhongMaterial({
  map: texture,
  side: THREE.DoubleSide,
});
const mesh = new THREE.Mesh(planeGeo, planeMat);
mesh.rotation.x = Math.PI * -.5;
scene.add(mesh);

const grassTexture = new THREE.TextureLoader().load('grass.png');
grassTexture.wrapS = THREE.RepeatWrapping;
grassTexture.wrapT = THREE.RepeatWrapping;
const parkSize = 25;
grassTexture.repeat.set(parkSize/2, parkSize/2);  // Increase to tile it more

const grassMaterial = new THREE.MeshPhongMaterial({
  map: grassTexture,
  side: THREE.DoubleSide,
});

const greenGeo = new THREE.PlaneGeometry(parkSize, parkSize);
const greenPatch = new THREE.Mesh(greenGeo, grassMaterial);

greenPatch.rotation.x = -Math.PI / 2;
greenPatch.position.set(0, 0.01, 0);

scene.add(greenPatch);




const sloader = new THREE.CubeTextureLoader();
const stexture = sloader.load([
    'sky/px.png',
    'sky/nx.png',
    'sky/py.png',
    'sky/ny.png',
    'sky/pz.png',
    'sky/nz.png',
]);
scene.background = stexture;


function render(time) {
    time *= 0.001;

    cubes.forEach((cube, ndx) => {
        const speed = 1 + ndx * 0.1;
        const rot = time * speed;
        cube.rotation.x = rot;
        cube.rotation.y = rot;
    });

    if (carModel && roadPath.length > 1) {
        const target = roadPath[currentPathIndex];
        const pos = carModel.position;
      
        const direction = new THREE.Vector3().subVectors(target, pos);
        const distance = direction.length();
      
        if (distance < 0.1) {
            currentPathIndex = (currentPathIndex - 1 + roadPath.length) % roadPath.length;
        } else {
          direction.normalize();
          carModel.position.add(direction.multiplyScalar(carSpeed * 0.016)); // ~60fps
      
          // Face movement direction
          const angle = Math.atan2(direction.x, direction.z);
          carModel.rotation.y = angle;
        }
    }

    if (policeModel && carModel) {
        const policePos = policeModel.position;
        const targetPos = carModel.position;
      
        const chaseDir = new THREE.Vector3().subVectors(targetPos, policePos);
        const chaseDist = chaseDir.length();
      
        if (chaseDist > 0.1) {
          chaseDir.normalize();
          const chaseSpeed = 6; 
          policeModel.position.add(chaseDir.multiplyScalar(chaseSpeed * 0.016));
      
          // Face the target
          const angle = Math.atan2(chaseDir.x, chaseDir.z);
          policeModel.rotation.y = angle;
        }
      }
    
    const blinkSpeed = 4; // number of flashes per second

    if (redLight && blueLight) {
        const blink = Math.floor(time * blinkSpeed) % 2 === 0;
        redLight.visible = blink;
        blueLight.visible = !blink;
    }

      
    

    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

document.addEventListener('click', () => {
    if (listener.context.state !== 'running') {
      listener.context.resume().then(() => {
        console.log('AudioContext resumed!');
      });
    }
  }, { once: true }); // only run once
  

function main() {
    cubes = [
        makeInstance(geometry, 0x44aa88,  0),
        makeInstance(geometry, 0x8844aa, -2),
        makeInstance(geometry, 0xaa8844,  2),
    ];
    requestAnimationFrame(render);
}

main();
