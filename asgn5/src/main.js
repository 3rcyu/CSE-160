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
renderer.shadowMap.enabled = true;


document.body.appendChild( renderer.domElement );

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 5, 0);
controls.update();

// Create a global audio listener
const listener = new THREE.AudioListener();
camera.add(listener); // Attach to camera so you hear from camera's perspective

const light = new THREE.DirectionalLight(0xFFFFFF, 3);
light.castShadow = true;
light.position.set(-1, 15, 20);
scene.add(light);

light.shadow.camera.left = -50;
light.shadow.camera.right = 50;
light.shadow.camera.top = 50;
light.shadow.camera.bottom = -50;

light.shadow.mapSize.width = 4096;
light.shadow.mapSize.height = 4096;

const ambient = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambient);
/*
const shadowHelper = new THREE.CameraHelper(light.shadow.camera);
scene.add(shadowHelper);

//visual
const helper = new THREE.CameraHelper(light.shadow.camera);
scene.add(helper);
*/
//const geometry = new THREE.BoxGeometry(1, 1, 1);

function updateCamera() {
    camera.updateProjectionMatrix();
}

/*
const gui = new GUI();
gui.add(camera, 'fov', 1, 180).onChange(updateCamera);
const minMaxGUIHelper = new MinMaxGUIHelper(camera, 'near', 'far', 0.1);
gui.add(minMaxGUIHelper, 'min', 0.1, 50, 0.1).name('near').onChange(updateCamera);
gui.add(minMaxGUIHelper, 'max', 0.1, 50, 0.1).name('far').onChange(updateCamera);
*/

// Load GLB model
const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/'); // Use CDN decoder
loader.setDRACOLoader(dracoLoader);

loader.load(
    'City Pack/Pizza Corner.glb',
    function (gltf) {
      const pBuilding = gltf.scene;
      pBuilding.scale.set(2,2,2);
      pBuilding.position.set(-8.75,0,-15);
      pBuilding.rotation.y = -Math.PI / 2;
      pBuilding.traverse(child => {
        if (child.isMesh) child.castShadow = true;
      });
      
      scene.add(gltf.scene);
    },
    xhr => console.log((xhr.loaded / xhr.total * 100) + '% loaded'),
    err => console.error('An error happened loading the GLB:', err)
  );

loader.load(
    'City Pack/Big Building.glb',
    function (gltf) {
        const bigBuilding = gltf.scene;
        bigBuilding.scale.set(2,2,2);
        bigBuilding.position.set(18,0,-5);
        bigBuilding.rotation.y = -Math.PI / 2;
        bigBuilding.traverse(child => {
            if (child.isMesh) child.castShadow = true;
          });
        scene.add(gltf.scene);
    },
    xhr => console.log((xhr.loaded / xhr.total * 100) + '% loaded'),
    err => console.error('An error happened loading the GLB:', err)
);

loader.load(
    'City Pack/Building Red.glb',
    function (gltf) {
      const rBuilding = gltf.scene;
      rBuilding.scale.set(2,2,2);
      rBuilding.position.set(15,0,11);
      rBuilding.rotation.y = -Math.PI / 2;
      rBuilding.traverse(child => {
        if (child.isMesh) child.castShadow = true;
      });
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
        bBuilding.traverse(child => {
            if (child.isMesh) child.castShadow = true;
          });
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

        gBuilding.traverse(child => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        scene.add(gBuilding);

        function addClone(x, y, z, rotY) {
            const inst = gBuilding.clone(true);  // deep clone
            inst.position.set(x, y, z);
            inst.rotation.y = rotY;
            inst.traverse(child => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            scene.add(inst);
        }

        addClone(15, 0, -12, -Math.PI / 2);

        for(let i = 0; i < 3; i++) addClone(5 * i, 0, 15, -Math.PI);
        for(let i = 0; i < 3; i++) addClone(-5 * i, 0, 15, -Math.PI);
        for(let i = 0; i < 3; i++) addClone(5 * i, 0, -15, 0);
        for(let i = 0; i < 2; i++) addClone(-5 * i, 0, -15, 0);
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
      tree.traverse(child => {
        if (child.isMesh) child.castShadow = true;
      });
      
      scene.add(gltf.scene);
    },
    xhr => console.log((xhr.loaded / xhr.total * 100) + '% loaded'),
    err => console.error('An error happened loading the GLB:', err)
  );

  loader.load(
    'City Pack/Street Light.glb',
    function (gltf) {
      const lamp = gltf.scene;
      lamp.scale.set(1, 1, 1);
      lamp.position.set(9, 0, 10);
  
      lamp.traverse(child => {
        if (child.isMesh) child.castShadow = true;
      });
  
      scene.add(lamp);
  
      // Create and configure the spotlight
      const color = 0xFFFFFF;
      const intensity = 150;
      const slight = new THREE.SpotLight(color, intensity, 15, Math.PI / 6, 0.5, 2);
      slight.castShadow = true;
  
      // Position the spotlight above lamp
      slight.position.set(9, 5.5, 12); 
      slight.target.position.set(9, 0, 12); // Aim at the ground
  
      scene.add(slight);
      scene.add(slight.target);
  
      //helper to visualize
      //const helper = new THREE.SpotLightHelper(slight);
      //scene.add(helper);
    },
    xhr => console.log((xhr.loaded / xhr.total * 100) + '% loaded'),
    err => console.error('An error happened loading the GLB:', err)
  );
  

let carModel = null;
const roadPath = [];  // will store all tile center positions
let currentPathIndex = 0;
const carSpeed = 6;


loader.load(
  'City Pack/Sports Car.glb',
  function (gltf) {
    carModel = gltf.scene;
    carModel.scale.set(0.25, 0.25, 0.25);  
    carModel.position.set(10, -0.1, 10);     // Position 
    carModel.traverse(child => {
        if (child.isMesh) child.castShadow = true;
      });
      
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
      policeModel.position.set(15, 0, 16);     // Position 
      
      policeModel.traverse(child => {
        if (child.isMesh) child.castShadow = true;
      });
      

        // Create red and blue lights
        redLight = new THREE.PointLight(0xff0000, 1, 5);
        blueLight = new THREE.PointLight(0x0000ff, 1, 5);

        // Position lights on top of the car 
        redLight.position.set(-0.3, 1.5, 0);
        blueLight.position.set(0.3, 1.5, 0);

        // Attach to police car
        policeModel.add(redLight);
        policeModel.add(blueLight);
        // Create positional audio and attach to police car
        const sirenSound = new THREE.PositionalAudio(listener);

        // Load the siren sound and play
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

        tile.castShadow = true;
        tile.receiveShadow = true;
        scene.add(tile);

        // Save this tile center to path for the car
        const pathPoint = position.clone().setY(0.1); // car height level
        roadPath.push(pathPoint);
      }
      
    //Straight tiles
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

    // ↱ Right turn — rotated 90° 
    placeTile(tileCorner, pos.clone(), Math.PI);
    dir.set(-1, 0, 0); //-X
    pos.add(dir.clone().multiplyScalar(tileLength));

    //More straight tiles
    for (let i = 0; i < 11; i++) {
        placeTile(tileStraight, pos.clone(),Math.PI / 2);
        pos.add(dir.clone().multiplyScalar(tileLength));
    }

    // ↱ Right turn — rotated 90° around Z axis
    placeTile(tileCorner, pos.clone(), Math.PI/2);
    dir.set(0, 0, -1); // update direction to -Z
    pos.add(dir.clone().multiplyScalar(tileLength));

    // ⬇️ More straight tiles
    for (let i = 0; i < 11; i++) {
        placeTile(tileStraight, pos.clone(),Math.PI);
        pos.add(dir.clone().multiplyScalar(tileLength));
    }

    // ↱ Right turn 
    placeTile(tileCorner, pos.clone(), -Math.PI*2);
    dir.set(1, 0, 0); // update direction to +X
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
  

//Checkerboard plane
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

//grass plane park
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
greenPatch.receiveShadow = true;
scene.add(greenPatch);


function makeInstance(geometry, color, x) {
    const material = new THREE.MeshPhongMaterial({color});
    const cube = new THREE.Mesh(geometry, material);
    cube.position.x = x;
    scene.add(cube);
    return cube;
}

//random sphere monument
const radius = 1.75; 
const widthSegments = 16;
const heightSegments = 16;
const sphereTexture = new THREE.TextureLoader().load('marble.jpg');

const sphereGeo = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
const sphereMaterial = new THREE.MeshPhongMaterial({
    map: sphereTexture,
  });
  
const sphere = new THREE.Mesh(sphereGeo, sphereMaterial);
sphere.position.set(0, 2, 0); 
sphere.castShadow = true;
sphere.receiveShadow = true;

scene.add(sphere);

// cylinder base
const baseRadius = 2;
const baseHeight = 0.5;
const radialSegments = 16;

const baseGeo = new THREE.CylinderGeometry(baseRadius, baseRadius, baseHeight, radialSegments);
const baseMaterial = new THREE.MeshPhongMaterial({ color: 'gray' });

const base = new THREE.Mesh(baseGeo, baseMaterial);
base.position.set(0, 0, 0); 
base.castShadow = true;
base.receiveShadow = true;

scene.add(base);



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
    /*
    cubes.forEach((cube, ndx) => {
        const speed = 1 + ndx * 0.1;
        const rot = time * speed;
        cube.rotation.x = rot;
        cube.rotation.y = rot;
    });
    */
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
          const chaseSpeed = 5; 
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
    /*
    cubes = [
        makeInstance(geometry, 0x44aa88,  0),
        makeInstance(geometry, 0x8844aa, -2),
        makeInstance(geometry, 0xaa8844,  2),
    ];
    */
    requestAnimationFrame(render);
}

main();
