// Vertex shader program
var VSHADER_SOURCE = `
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  varying vec2 v_UV;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  uniform vec4 u_FragColor;

  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform sampler2D u_Sampler2;

  uniform int u_whichTexture;
  void main() {
    //if(u_whichTexture == -2){
    // gl_FragColor = u_FragColor;                     //Use color

    //} else if(u_whichTexture == -1){                  //Use UV debug color
    // gl_FragColor = vec4(v_UV, 1.0, 1.0);

    //} else if(u_whichTexture == 0){                   //Use texture 0
     // gl_FragColor = texture2D(u_Sampler0, v_UV);

    //} else {
    //  gl_FragColor = vec4(1,.2,.2,1);                 // Error, put Redish
    //}
    if (u_whichTexture == -2) {
      gl_FragColor = u_FragColor;
    } else if (u_whichTexture == -1) {
      gl_FragColor = vec4(v_UV, 1.0, 1.0);
    } else if (u_whichTexture == 0) {
      gl_FragColor = texture2D(u_Sampler0, v_UV);
    } else if (u_whichTexture == 1) {
      gl_FragColor = texture2D(u_Sampler1, v_UV);
    } else if (u_whichTexture == 2) {
      gl_FragColor = texture2D(u_Sampler2, v_UV);
    } else {
      gl_FragColor = vec4(1.0, 0.2, 0.2, 1.0); // fallback error color
    }

  }`

let canvas;
let gl;
let a_Position;
let a_UV;
let u_FragColor;
let u_Size;
let u_Sampler0;
let u_whichTexture;

let u_ModelMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_GlobalRotateMatrix;


function setupWebGl(){
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  //gl = getWebGLContext(canvas);
  gl = canvas.getContext("webgl", {preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  gl.enable(gl.DEPTH_TEST);
}

function connectVariablesToGLSL(){
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0) {
    console.log('Failed to get the storage location of a_UV');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
  if (!u_whichTexture) {
    console.log('Failed to get the storage location of u_whichTexture');
    return;
  }
  /*
  u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  if (!u_Size) {
    console.log('Failed to get the storage location of u_Size');
    return;
  }
  */
  //Get the storage location of u_ModelMatrix
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }

  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix) {
    console.log('Failed to get the storage location of u_ViewMatrix');
    return;
  }

  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if (!u_ProjectionMatrix) {
    console.log('Failed to get the storage location of u_ProjectionMatrix');
    return;
  }

  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');


  if (!u_ViewMatrix) {
    console.log('Failed to get the storage location of u_Sampler0');
    return;
  }

  //Set an initial value for this matrix to identity
  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
  
}

//Constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;
const SPRAY = 3;

let g_selectedColor= [1.0,1.0,1.0,1.0];
let g_selectedSize = 10;
let g_selectedType = POINT;
//let g_selectedSegments = 10;
//let g_displayedDrawing = false;

let g_leftFootAngle = 0;
let g_leftFoot2Angle = 0;
let g_rightFootAngle = 0;
let g_rightFoot2Angle = 0;

let g_armAngle = 0;
let g_leftArmAngle = 0;
let g_rightArmAngle = 0;
let g_wandAngle = 0;
let g_wandStar = 0;

let g_globalAngle = 0;
let g_runAnimation = false;
let g_floatAnimation = false;
let g_wandWaving = false;


let g_mouseDown = false;
let g_lastX = 0;
let g_lastY = 0;
let g_globalAngleY = 0; // left-right rotation (Y axis)
let g_globalAngleX = 0; // up-down rotation (X axis)

let g_floatOffset = 0;
let g_dustPuffs = [];

let g_camera;


function addActionsUI(){
  //document.getElementById('angleSlider').addEventListener('mousemove', function() {g_globalAngleY = this.value; renderAllShapes(); });
}

function initTextures(gl, n) {
  /*
  // Get the storage location of u_Sampler
  var u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if (!u_Sampler0) {
    console.log('Failed to get the storage location of u_Sampler0');
    return false;
  }
  */

  var image = new Image();  // Create the image object
  if (!image) {
    console.log('Failed to create the image object');
    return false;
  }
  // Register the event handler to be called on loading an image
  //image.onload = function(){ sendTextureToGLSL(image); };
  // Tell the browser to load an image
  //image.src = 'sky.jpg';
  
  //Add more texture 
  let image0 = new Image();
  image0.onload = function() {
    sendTextureToGLSL(image0, 0); // bind to TEXTURE0
  };
  image0.src = 'sky.jpg';

  // Test grass texture
  let image1 = new Image();
  image1.onload = function() {
    sendTextureToGLSL(image1, 1); // bind to TEXTURE1
  };
  image1.src = 'pixelgrass.png';

  let image2 = new Image();
  image2.onload = function() {
    sendTextureToGLSL(image2, 2); // bind to TEXTURE1
  };
  image2.src = 'stone.png';

  return true;
}
/*
function sendTextureToGLSL(image) {
  var texture = gl.createTexture();   // Create a texture object
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE0);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  
  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler0, 0);
  
  //gl.clear(gl.COLOR_BUFFER_BIT);   // Clear <canvas>

  //gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw the rectangle
  console.log('finished loadTexture');
}
*/
function sendTextureToGLSL(image, unit) {
  var texture = gl.createTexture();   // Create a texture object
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis

  // Activate the correct texture unit
  gl.activeTexture(gl.TEXTURE0 + unit);
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Clamp wrap mode for NPOT compatibility
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);


  // Set texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  // Assign the texture to the correct sampler
  if (unit === 0) gl.uniform1i(u_Sampler0, 0);
  else if (unit === 1) gl.uniform1i(u_Sampler1, 1);
  else if (unit === 2) gl.uniform1i(u_Sampler2, 2);

  console.log('Finished loading texture into unit', unit);
}

function main() {
  setupWebGl();

  connectVariablesToGLSL();
  
  addActionsUI();

  //initTriangleBuffer3D(gl);
  /*
  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  canvas.onmousemove = function(ev){
    if(ev.buttons == 1){
      click(ev)
    }
  };
  */

  g_camera = new Camera(canvas);

  document.onkeydown = keydown;

  enablePointerLockControls(canvas);

  initTextures();
  
  
  canvas.onmousedown = function(ev) {
    g_mouseDown = true;
    g_lastX = ev.clientX;
    g_lastY = ev.clientY;
  };
  
  canvas.onmouseup = function(ev) {
    g_mouseDown = false;
  };

  canvas.onmousemove = function(ev) {
    if (g_mouseDown) {
      let deltaX = ev.clientX - g_lastX;
      let deltaY = ev.clientY - g_lastY;
  
      g_globalAngleY -= deltaX * 0.5; // horizontal mouse -> rotate around Y axis
      g_globalAngleX -= deltaY * 0.5; // vertical mouse -> rotate around X axis
  
      // Clamp the X angle so you can't flip over completely (optional)
      g_globalAngleX = Math.max(Math.min(g_globalAngleX, 90), -90);
  
      g_lastX = ev.clientX;
      g_lastY = ev.clientY;
  
      //renderAllShapes();
    }
  };
  
  
  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.5, 1.0);

  // Clear <canvas>
  //gl.clear(gl.COLOR_BUFFER_BIT);

  //renderAllShapes();
  requestAnimationFrame(tick);
}

function enablePointerLockControls(canvas) {
  canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock;
  canvas.onclick = () => canvas.requestPointerLock();

  document.addEventListener("pointerlockchange", () => {
    if (document.pointerLockElement === canvas) {
      document.addEventListener("mousemove", onMouseMove, false);
    } else {
      document.removeEventListener("mousemove", onMouseMove, false);
    }
  }, false);
}

function onMouseMove(e) {
  const yawSpeed = e.movementX * 0.002;        // ← reversed
  const pitchSpeed = -e.movementY * 0.002;     // keep pitch direction
  g_camera.rotateYaw(pitchSpeed, yawSpeed);
  renderAllShapes();
}


var g_shapesList = [];
//var g_points = [];  // The array for the position of a mouse press
//var g_colors = [];  // The array to store the color of a point
//var g_sizes = [];

var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0 - g_startTime;

//Called by browser repeatedly whenever its time
function tick(){
  //Print some debug to know we are running
  g_seconds = performance.now()/1000.0 - g_startTime;
  //console.log(g_seconds);
  updateAnimationAngles();
  //Draw everything
  renderAllShapes();
  //Tell browser to update again when it has time
  requestAnimationFrame(tick);
}

function updateAnimationAngles(){
  if(g_runAnimation){
    g_floatAnimation = false;
    g_leftFootAngle = (50*Math.sin(-7*g_seconds));
    g_rightFootAngle = (50*Math.sin(7*g_seconds));

    g_leftArmAngle = (-60*Math.sin(5*g_seconds));
    g_rightArmAngle = (60*Math.sin(5*g_seconds));

    g_floatOffset = 0.02 * Math.sin(g_seconds);

    // Create new dust puff every few frames
    if (Math.random() < 0.1) { // 20% chance every frame
      let offsetX = (Math.random() - 0.5) * 0.2; // small left-right randomness
      let offsetZ = -0.3 + (Math.random() * 0.1); // slight randomness backwards
      g_dustPuffs.push(new DustPuff(offsetX, -0.35, 0.75 + offsetZ));
 
      // adjust position if needed (behind Kirby)
    }
  }
  if(g_floatAnimation){
    g_runAnimation = false;
    //g_armAngle = (60*Math.sin(5*g_seconds));
    g_leftArmAngle = (60*Math.sin(5*g_seconds));
    g_rightArmAngle = (60*Math.sin(5*g_seconds));
    g_floatOffset = 0.03 * Math.sin(g_seconds * 2.0);

    g_leftFootAngle = -80;
    g_rightFootAngle = -80;
  }

  if (g_wandWaving) {
    g_wandAngle = 20 * Math.sin(5 * g_seconds); 
  }
  
}

function keydown(ev){
  const speed = 0.2;
  const angle = 5; // degrees
  if(ev.keyCode == 68){ // D key - move right
    g_camera.moveRight(speed);
  } else
  if(ev.keyCode == 65){ // A key - move left
    g_camera.moveLeft(speed);
  } else
  if(ev.keyCode == 87){ // W key - move forward
    g_camera.moveForward(speed);
  } else
  if(ev.keyCode == 83){ // S key - move backward
    g_camera.moveBackwards(speed);
  } else
  if(ev.keyCode == 81){ // Q key - pan left
      g_camera.panLeft(angle);
  }
  else if(ev.keyCode == 69){ // E key - pan right
      g_camera.panRight(angle);
  }
  if(ev.keyCode == 32){ // space key - move up
    g_camera.moveUp(speed);
  } else
  if(ev.keyCode == 16){ // Shift key - move down
    g_camera.moveDown(speed);
  }
  
  
  renderAllShapes();
  console.log(ev.keyCode);
}



var g_eye = [0,0,3];
var g_at = [0,0,-100];
var g_up = [0,1,0];

var g_map = [
[1, 1, 1, 1, 1, 1, 1, 1], // 1=wall 0= no wall
[1, 0, 0, 0, 0, 0, 0, 1],
[1, 0, 0, 0, 0, 0, 0, 1],
[1, 0, 0, 1, 2, 0, 0, 1],
[1, 0, 0, 0, 0, 0, 0, 1],
[1, 0, 0, 0, 0, 0, 0, 1],
[1, 0, 0, 0, 1, 0, 0, 1],
[1, 0, 0, 0, 0, 0, 0, 1],
];

function drawMap() {
  const body = new Cube(); // Create only once
  body.textureNum = 1;
  body.color = [0.8, 1.0, 1.0, 1.0];

  for (let x = 0; x < 32; x++) {
    for (let y = 0; y < 32; y++) {
      let matrix = new Matrix4();
      matrix.translate(x - 16, -1.75, y - 16);
      body.matrix = matrix;
      body.renderFaster();
    }
  }
}


function drawMap2() {
  const cube = new Cube(); // Create only once
  cube.textureNum = 2;
  cube.color = [1.0, 1.0, 1.0, 1.0];

  for (let x = 0; x < g_map.length; x++) {
    for (let z = 0; z < g_map[x].length; z++) {
      let height = g_map[x][z];
      for (let y = 0; y < height; y++) {
        let matrix = new Matrix4();
        matrix.translate(x - g_map.length / 2, y - 1, z - g_map[x].length / 2);
        cube.matrix = matrix;
        cube.renderFaster();
      }
    }
  }
}




function renderAllShapes(){
  var startTime = performance.now();

  //Pass projection matrix
  var projMat = new Matrix4();
  projMat.setPerspective(60, canvas.width/canvas.height, .1, 100);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

  //Pass view matrix
  //var viewMat = new Matrix4();
  //viewMat.setLookAt(g_eye[0], g_eye[1], g_eye[2], g_at[0], g_at[1], g_at[2], g_up[0], g_up[1], g_up[2]);
  /*
  viewMat.setLookAt(
    g_camera.eye.x, g_camera.eye.y, g_camera.eye.z,
    g_camera.at.x, g_camera.at.y, g_camera.at.z,
    g_camera.up.x, g_camera.up.y, g_camera.up.z
  )
  */
  //viewMat.setLookAt(0,0,2, 0,0,-100,  0,1,0); //(eye,at,up)
  //gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);
  gl.uniformMatrix4fv(u_ViewMatrix, false, g_camera.viewMatrix.elements);



  //var globalRotMat = new Matrix4().rotate(g_globalAngle,0,1,0);
  var globalRotMat = new Matrix4();
  globalRotMat.rotate(g_globalAngleX, 1, 0, 0); // Rotate up/down first (X axis)
  globalRotMat.rotate(g_globalAngleY, 0, 1, 0); // Then rotate left/right (Y axis)

  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  // Update dust puffs
  //for (let i = 0; i < g_dustPuffs.length; i++) {
  //  g_dustPuffs[i].update();
  //}
  // Remove old dead puffs
  //g_dustPuffs = g_dustPuffs.filter(p => !p.isDead());


  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  //gl.clear(gl.COLOR_BUFFER_BIT);
  
  //Draw a test triagnle
  //drawTriangle3D([-1.0,0.0,0.0, -0.5,-1.0,0.0, 0.0,0.0,0.0]);
  
  drawMap();
  drawMap2();
  /*
  //Draw the floor
  var body = new Cube();
  body.color = [1.0,0.0,0.0,1.0];
  body.textureNum = 1;
  body.matrix.translate(0, -.75, 0.0);
  body.matrix.scale(10, 0, 10);
  body.matrix.translate(-.5, 0, -0.5);
  body.render();
  */
  //Draw the sky
  var sky = new Cube();
  sky.color = [0.5,0.7,0.9,1.0];
  //sky.textureNum = 1;
  sky.matrix.scale(50,50, 50);
  sky.matrix.translate(-.5, -.5, -0.5);
  sky.renderFaster();
  /*
  //Draw a cube
  var body = new Cube();
  body.color = [1.0,0.0,0.0,1.0];
  body.textureNum = 0;
  body.matrix.translate(-.25, -.75, 0.0);
  body.matrix.rotate(-5,1,0,0);
  body.matrix.scale(0.5, .3, .5);
  body.render();
  */
  /*
  //Draw a left arm
  var leftArm = new Cube();
  leftArm.color = [1.0,1.0,0.0,1.0];
  leftArm.matrix.setTranslate(0, -.5, 0.0);
  leftArm.matrix.rotate(-5, 1, 0, 0);
  leftArm.matrix.rotate(-g_yellowAngle, 0, 0, 1);
  leftArm.render();
  
  
  //if(g_yellowAnimation){
  //  leftArm.matrix.rotate(45*Math.sin(g_seconds), 0, 0, 1);
  //}
  //else{
  //  leftArm.matrix.rotate(-g_yellowAngle, 0, 0, 1);
  //}
  

  var yellowCoordinatesMat = new Matrix4(leftArm.matrix);
  leftArm.matrix.scale(0.25, .7, .5);
  leftArm.matrix.translate(-.5, 0, 0.0);
  leftArm.render();

  //Test box
  var box = new Cube();
  box.color = [1.0,0.0,1.0,1.0];
  box.matrix = yellowCoordinatesMat;
  box.matrix.translate(0,.65, 0);
  box.matrix.rotate(g_magentaAngle,0,0,1)
  box.matrix.scale(0.3, .3, .3);
  box.matrix.translate(-.5,0, -0.001);
  box.render();
  
  var k=20;
  for(var i=1; i<k; i++){
    var c = new Cube();
    c.matrix.translate(-.8,1.9*i/k-1.0,0);
    c.matrix.rotate(g_seconds*100,1,1,1);
    c.matrix.scale(.1,.5/k,1.0/k);
    c.render();
  }
  */
  /*
  // Draw dust puffs
  for (let i = 0; i < g_dustPuffs.length; i++) {
    let puff = g_dustPuffs[i];
    var dust = new Sphere();
    dust.color = [0.8, 0.8, 0.8, puff.opacity]; // Light gray with fading opacity
    dust.matrix.translate(puff.x - puff.size/2, puff.y - puff.size/2, puff.z - puff.size/2);
    dust.matrix.scale(puff.size, puff.size, puff.size);
    dust.render();
  }
  */
  
  /*
  // -------- Kirby --------

  // FLOATING OFFSET
  var floatOffset = g_floatOffset;
  // ----- KIRBY -----

  let kirbyCenterX = 0.0;
  let kirbyCenterY = 0.0 + floatOffset;
  let kirbyCenterZ = 0.0;

  // Fake shadow when float
  if(g_floatAnimation){
    var shadow = new Sphere();
    shadow.color = [0.0, 0.0, 0.0, 0.9]; 
    shadow.matrix.translate(kirbyCenterX - 0.2, -0.7, kirbyCenterZ - 0.2);
    shadow.matrix.scale(0.4, 0.01, 0.4); // squished vertically into a flat oval
    shadow.render();
  }


  // BODY
  var body = new Sphere();
  body.color = [1.0, 0.6, 0.8, 1.0]; // Light pink
  body.matrix.translate(kirbyCenterX - 0.375, kirbyCenterY - 0.375, kirbyCenterZ - 0.375);
  body.matrix.scale(0.75, 0.75, 0.75);
  body.render();


  // LEFT ARM
  var leftArm = new Sphere();
  leftArm.color = [1.0, 0.6, 0.8, 1.0];
  leftArm.matrix.translate(kirbyCenterX - 0.5, kirbyCenterY - 0.1, kirbyCenterZ);
  //leftArm.matrix.rotate(g_armAngle,1,0,0);
  leftArm.matrix.rotate(-g_leftArmAngle,1,0,0);
  var armCoordinatesMat = new Matrix4(leftArm.matrix);
  leftArm.matrix.scale(0.3, 0.2, 0.2);
  leftArm.render();

  // RIGHT ARM
  var rightArm = new Sphere();
  rightArm.color = [1.0, 0.6, 0.8, 1.0];
  rightArm.matrix.translate(kirbyCenterX + 0.2, kirbyCenterY - 0.1, kirbyCenterZ);
  //rightArm.matrix.rotate(g_armAngle,1,0,0);
  rightArm.matrix.rotate(-g_rightArmAngle,1,0,0);
  rightArm.matrix.scale(0.3, 0.2, 0.2);
  rightArm.render();

  // MAGIC WAND
  var wand = new Cube();
  wand.color = [1.0, 0.8, 0.2, 1.0]; // Golden yellow wand
  wand.matrix = armCoordinatesMat;
  //wand.matrix.rotate(g_wandAngle, 0, 0, 1);
  wand.matrix.translate(kirbyCenterX + 0.05, kirbyCenterY + 0.1, kirbyCenterZ );
  wand.matrix.rotate(g_wandAngle, 0, 0, 1); 
  //wand.matrix.rotate(30, 0, 0, 1); // Tilt the wand a little
  wand.matrix.scale(0.04, 0.4, 0.04); 
  wand.render();

  // WAND TIP
  var wandStar = new Cube();
  wandStar.color = [0.0, 1.0, 1.0, 1.0]; // Bright yellow
  wandStar.matrix = new Matrix4(wand.matrix);
  wandStar.matrix.translate(kirbyCenterX - 0.675, kirbyCenterY + 1, kirbyCenterZ - 0.55);
  wandStar.matrix.scale(2.2, 0.2, 2.2);
  wandStar.matrix.rotate(g_wandStar, 1, 1, 0); 
  wandStar.render();


  // LEFT FOOT
  var leftFoot = new Cube();
  leftFoot.color = [0.9, 0.0, 0.1, 1.0]; // Red
  leftFoot.matrix.rotate(g_leftFootAngle,1,0,0);
  leftFoot.matrix.translate(kirbyCenterX - 0.18, kirbyCenterY - 0.35, kirbyCenterZ - 0.05);
  leftFoot.matrix.rotate(-15,1,-1,0);
  leftFoot.matrix.scale(0.18, 0.08, -0.25);
  leftFoot.render();
  //toes...
  var leftFoot2 = new Cube();
  leftFoot2.color = [0.9, 0.0, 0.1, 1.0]; // Red
  leftFoot2.matrix.rotate(g_leftFoot2Angle,0,0,1);
  leftFoot2.matrix.rotate(g_leftFootAngle,1,0,0);
  leftFoot2.matrix.translate(kirbyCenterX - 0.195, kirbyCenterY - 0.395, kirbyCenterZ - 0.29);
  leftFoot2.matrix.rotate(-20,1,-1,0);
  leftFoot2.matrix.scale(0.15, 0.06, -0.1);
  leftFoot2.render();

  // RIGHT FOOT
  var rightFoot = new Cube();
  rightFoot.color = [0.9, 0.0, 0.1, 1.0];
  rightFoot.matrix.rotate(g_rightFootAngle,1,0,0);
  rightFoot.matrix.translate(kirbyCenterX + 0.02, kirbyCenterY - 0.35, kirbyCenterZ - 0.05);
  rightFoot.matrix.rotate(15,-1,-1,0);
  rightFoot.matrix.scale(0.18, 0.08, -0.25);
  rightFoot.render();

  var rightFoot2 = new Cube();
  rightFoot2.color = [0.9, 0.0, 0.1, 1.0];
  rightFoot2.matrix.rotate(g_rightFoot2Angle,0,0,1);
  rightFoot2.matrix.rotate(g_rightFootAngle,1,0,0);
  rightFoot2.matrix.translate(kirbyCenterX + 0.065, kirbyCenterY - 0.395, kirbyCenterZ - 0.29);
  rightFoot2.matrix.rotate(20,-1,-1,0);
  rightFoot2.matrix.scale(0.15, 0.06, -0.1);
  rightFoot2.render();

  // LEFT EYE
  var leftEye = new Cube();
  leftEye.color = [0.0, 0.0, 0.0, 1.0]; // Dark blue
  leftEye.matrix.translate(kirbyCenterX - 0.1, kirbyCenterY + 0.1, kirbyCenterZ - 0.35);
  leftEye.matrix.rotate(-15,-1,0,0);
  leftEye.matrix.scale(0.05, 0.18, 0.002);
  leftEye.render();

  var leftWhite = new Cube();
  leftWhite.color = [1.0, 1.0, 1.0, 1.0]; // White
  leftWhite.matrix.translate(kirbyCenterX - 0.1, kirbyCenterY + 0.21, kirbyCenterZ - 0.33);
  leftWhite.matrix.rotate(-15,-1,0,0);
  leftWhite.matrix.scale(0.04, 0.06, 0.001);
  leftWhite.render();

  var leftBlue = new Cube();
  leftBlue.color = [0.1, 0.0, 0.8, 1.0]; // Dark Blue
  leftBlue.matrix.translate(kirbyCenterX - 0.095, kirbyCenterY + 0.1, kirbyCenterZ - 0.352);
  leftBlue.matrix.rotate(-15,-1,0,0);
  leftBlue.matrix.scale(0.035, 0.05, 0.001);
  leftBlue.render();

  // RIGHT EYE
  var rightEye = new Cube();
  rightEye.color = [0.0, 0.0, 0.0, 1.0];
  rightEye.matrix.translate(kirbyCenterX + 0.065, kirbyCenterY + 0.1, kirbyCenterZ - 0.35);
  rightEye.matrix.rotate(-15,-1,0,0);
  rightEye.matrix.scale(0.05, 0.18, 0.002);
  rightEye.render();
  
  var rightWhite = new Cube();
  rightWhite.color = [1.0, 1.0, 1.0, 1.0]; // White
  rightWhite.matrix.translate(kirbyCenterX + 0.065, kirbyCenterY + 0.21, kirbyCenterZ - 0.33);
  rightWhite.matrix.rotate(-15,-1,0,0);
  rightWhite.matrix.scale(0.04, 0.06, 0.001);
  rightWhite.render();

  var rightBlue = new Cube();
  rightBlue.color = [0.1, 0.0, 0.8, 1.0]; // Dark Blue
  rightBlue.matrix.translate(kirbyCenterX + 0.07, kirbyCenterY + 0.1, kirbyCenterZ - 0.352);
  rightBlue.matrix.rotate(-15,-1,0,0);
  rightBlue.matrix.scale(0.035, 0.05, 0.001);
  rightBlue.render();

  // MOUTH
  var mouth = new Cube();
  mouth.color = [0.8, 0.0, 0.2, 1.0]; // Dark pink
  mouth.matrix.translate(kirbyCenterX - 0.005, kirbyCenterY - 0.03, kirbyCenterZ - 0.375);
  mouth.matrix.scale(0.03, 0.06, 0.001);
  mouth.render();
  var mouth2 = new Cube();
  mouth2.color = [1.0, 0.3, 0.3, 1.0]; // Dark pink
  mouth2.matrix.translate(kirbyCenterX - 0.005, kirbyCenterY - 0.025, kirbyCenterZ - 0.37501);
  mouth2.matrix.scale(0.025, 0.025, 0.001);
  mouth2.render();

  // LEFT BLUSH
  var leftBlush = new Cube();
  leftBlush.color = [1.0, 0.4, 0.6, 1.0]; // Pink blush
  leftBlush.matrix.translate(kirbyCenterX - 0.22, kirbyCenterY + 0.02, kirbyCenterZ - 0.35);
  leftBlush.matrix.scale(0.08, 0.04, 0.01);
  leftBlush.render();

  // RIGHT BLUSH
  var rightBlush = new Cube();
  rightBlush.color = [1.0, 0.4, 0.6, 1.0];
  rightBlush.matrix.translate(kirbyCenterX + 0.15, kirbyCenterY + 0.02, kirbyCenterZ - 0.35);
  rightBlush.matrix.scale(0.08, 0.04, 0.01);
  rightBlush.render();
  */
  
  //check performance
  var duration = performance.now() - startTime;
  if (duration < 0.001) duration = 0.001; // prevent division by zero
  sendTextToHTML(" ms: " + Math.floor(duration) + " fps: " + Math.floor(10000/duration)/10, "numdot");
}

function sendTextToHTML(text, htmlID){
  var htmlElm = document.getElementById(htmlID);
  if(!htmlElm){
    console.log("Failed to get " + htmlID + " from HTML");
    return;
  }
  htmlElm.innerHTML = text;
}


