// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'uniform float u_Size;\n' +
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '  gl_PointSize = u_Size;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'uniform vec4 u_FragColor;\n' +  // uniform変数
  'void main() {\n' +
  '  gl_FragColor = u_FragColor;\n' +
  '}\n';

let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;

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

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  if (!u_Size) {
    console.log('Failed to get the storage location of u_Size');
    return;
  }
}

//Constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

let g_selectedColor= [1.0,1.0,1.0,1.0];
let g_selectedSize = 10;
let g_selectedType = POINT;
let g_selectedSegments = 10;
let g_displayedDrawing = false;

function addActionsUI(){
  //Buttons
  //document.getElementById('green').onclick = function() {g_selectedColor = [0.0,1.0,0.0,1.0];};
  //document.getElementById('red').onclick = function() {g_selectedColor = [1.0,0.0,0.0,1.0];};
  document.getElementById('clearButton').onclick = function() {g_shapesList=[]; renderAllShapes();};
  document.getElementById('drawButton').onclick = function() { displayDrawing();};

  document.getElementById('pointButton').onclick = function() {g_selectedType=POINT};
  document.getElementById('triButton').onclick = function() {g_selectedType=TRIANGLE};
  document.getElementById('circleButton').onclick = function() {g_selectedType=CIRCLE};

  //Color Slider
  document.getElementById('redSlider').addEventListener('mouseup', function() {g_selectedColor[0] = this.value/100;});
  document.getElementById('greenSlider').addEventListener('mouseup', function() {g_selectedColor[1] = this.value/100;});
  document.getElementById('blueSlider').addEventListener('mouseup', function() {g_selectedColor[2] = this.value/100;});

  //Size Slider
  document.getElementById('sizeSlider').addEventListener('mouseup', function() {g_selectedSize = this.value;});

  document.getElementById('segmentSlider').addEventListener('mouseup', function() {g_selectedSegments = this.value;});
}

function main() {
  setupWebGl();

  connectVariablesToGLSL();
  
  addActionsUI();

  document.getElementById('redSlider').value = 100;
  document.getElementById('greenSlider').value = 100;
  document.getElementById('blueSlider').value = 100;

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  canvas.onmousemove = function(ev){
    if(ev.buttons == 1){
      click(ev)
    }
  };
  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
}

var g_shapesList = [];
//var g_points = [];  // The array for the position of a mouse press
//var g_colors = [];  // The array to store the color of a point
//var g_sizes = [];

function click(ev) {
  if (g_displayedDrawing) {
    // 🧹 Reset canvas to black
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    g_shapesList = [];           // Clear any old shapes
    g_displayedDrawing = false;  // Reset the flag
  }
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  //Create and store the new point
  let point;
  if (g_selectedType == POINT){
    point = new Point();
  }
  else if (g_selectedType == TRIANGLE){
    point = new Triangle();
  }
  else{
    point = new Circle();
    point.segments = g_selectedSegments;
  }

  point.position=[x,y];
  point.color = g_selectedColor.slice();
  point.size = g_selectedSize;
  g_shapesList.push(point);
  
  //Draw every shape that is supposed to be in the canvas
  renderAllShapes();
}

function renderAllShapes(){
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  var len = g_shapesList.length;
  for(var i = 0; i < len; i++) {
    g_shapesList[i].render();
  }
}

function displayDrawing(){
  // Clear canvas
  gl.clearColor(1.0, 0.85, 0.75, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  g_displayedDrawing = true;

  //green holder
  gl.uniform4f(u_FragColor, 0.0, 0.5, 0.0, 1.0); // Green
  drawTriangle([
     0.0, -0.6,
     -0.1,  -0.3,
     0.1, -0.3
  ]);

  //cone
  gl.uniform4f(u_FragColor, 0.65, 0.4, 0.0, 1.0); // brown
  drawTriangle([
    -0.1, 0,
    -0.2,  0,
    -0.1, -0.3
  ]);
  gl.uniform4f(u_FragColor, 0.75, 0.4, 0.0, 1.0); // brown
  drawTriangle([
    0.1, 0,
    -0.1,  0,
    -0.1, -0.3
  ]);
  gl.uniform4f(u_FragColor, 0.8, 0.5, 0.1, 1.0); // brown yellow
  drawTriangle([
    -0.1,  -0.3,
     0.1,  0,
     0.1, -0.3
  ]);
  gl.uniform4f(u_FragColor, 0.9, 0.7, 0.2, 1.0); // lighter brown yellow
  drawTriangle([
    0.2,  0,
     0.1,  0,
     0.1, -0.3
  ]);
  gl.uniform4f(u_FragColor, 1.0, 1.0, 1.0, 1.0); // white
  drawTriangle([
    -0.2,  0,
    0.2, 0,
    0.2, 0.1
  ]);
  drawTriangle([
    -0.2,  0.3,
    -0.2, 0.1,
    0.2, 0.3
  ]);
  drawTriangle([
    -0.2,  0.1,
    -0.2, 0.4,
    -0.3, 0.1
  ]);
  //tiny
  drawTriangle([
    -0.2,  0.4,
    -0.1, 0.45,
    -0.1, 0.4
  ]);
  drawTriangle([
    -0.1,  0.4,
    -0.1, 0.45,
     0.0, 0.45
  ]);
  //tip
  drawTriangle([
    0.0,  0.45,
    -0.1, 0.45,
    0.0, 0.6
  ]);

  gl.uniform4f(u_FragColor, 0.95, 0.95, 1.0, 1.0); // blue white
  drawTriangle([
    -0.2,  0.1,
    -0.2, 0,
    0.2, 0.1
  ]);
  drawTriangle([
    -0.2,  0.1,
    -0.2, 0,
    -0.3, 0.1
  ]);
  drawTriangle([
    0.1,  0.4,
    -0.2, 0.3,
    -0.2, 0.4
  ]);
  drawTriangle([
    0.0,  0.4,
    0.1, 0.6,
    0.0, 0.6
  ]);

  gl.uniform4f(u_FragColor, 0.45, 0.7, 0.4, 1.0); // matcha
  drawTriangle([
    0.2,  0,
    0.2, 0.1,
    0.3, 0.1
  ]);
  drawTriangle([
    0.2,  0.3,
    0.2, 0.1,
    0.3, 0.1
  ]);
  drawTriangle([
    0.2,  0.3,
    0.2, 0.1,
    -0.2, 0.1
  ]);
  drawTriangle([
    0.1,  0.3,
    0.1, 0.6,
    0.2, 0.3
  ]);
  drawTriangle([
    0.1,  0.3,
    0.1, 0.4,
    -0.2, 0.3
  ]);
  drawTriangle([
    0.1,  0.4,
    0.1, 0.6,
    0.0, 0.4
  ]);
  //tiny
  drawTriangle([
    -0.1,  0.4,
     0.0, 0.45,
     0.0, 0.4
  ]);
  //tip
  drawTriangle([
    0.1,  0.7,
    0.1, 0.6,
    0.0, 0.6
  ]);
}