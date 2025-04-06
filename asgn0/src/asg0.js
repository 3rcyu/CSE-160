// DrawTriangle.js (c) 2012 matsuda
function main() {  
  // Retrieve <canvas> element
  canvas = document.getElementById('example');  
  if (!canvas) { 
    console.log('Failed to retrieve the <canvas> element');
    return false; 
  } 

  // Get the rendering context for 2DCG
  ctx = canvas.getContext('2d');

  // Draw a blue rectangle
  ctx.fillStyle = 'rgba(0, 0, 255, 1.0)'; // Set color to blue
  ctx.fillRect(120, 10, 150, 150);        // Fill a rectangle with the color

  ctx.clearRect(0,0, canvas.width, canvas.height);
  ctx.fillStyle = 'black';
  ctx.fillRect(0,0, canvas.width, canvas.height);
  
  //handleDrawEvent();
  //let v1 = new Vector3([2.25,2.25,0]);
  //drawVector(v1,"red");
}

function drawVector(v, color){
  ctx.strokeStyle = color;
  ctx.beginPath();

  const cx = canvas.width/2;
  const cy = canvas.height/2;

  let x = cx + v.elements[0]*20;
  let y = cy - v.elements[1]*20;

  ctx.moveTo(cx,cy);
  ctx.lineTo(x,y);
  ctx.stroke();
}

function handleDrawEvent(){
  ctx.clearRect(0,0, canvas.width, canvas.height);
  ctx.fillStyle = 'black';
  ctx.fillRect(0,0, canvas.width, canvas.height);

  let x1 = parseFloat(document.getElementById("x1Input").value);
  let y1 = parseFloat(document.getElementById("y1Input").value);
  let v1 = new Vector3([x1,y1,0]);

  let x2 = parseFloat(document.getElementById("x2Input").value);
  let y2 = parseFloat(document.getElementById("y2Input").value);
  let v2 = new Vector3([x2,y2,0]);

  drawVector(v1,"red");
  drawVector(v2,"blue");
}

function handleDrawOperationEvent() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Get v1
  let x1 = parseFloat(document.getElementById("x1Input").value);
  let y1 = parseFloat(document.getElementById("y1Input").value);
  let v1 = new Vector3([x1, y1, 0]);

  // Get v2
  let x2 = parseFloat(document.getElementById("x2Input").value);
  let y2 = parseFloat(document.getElementById("y2Input").value);
  let v2 = new Vector3([x2, y2, 0]);

  drawVector(v1, "red");
  drawVector(v2, "blue");

  // Get operation
  const op = document.getElementById("operationSelect").value;
  const scalar = parseFloat(document.getElementById("scalarInput").value);

  if (op === "add") {
    let v3 = new Vector3([x1, y1, 0]).add(new Vector3([x2, y2, 0]));
    drawVector(v3, "green");
  } 
  else if (op === "sub") {
    let v3 = new Vector3([x1, y1, 0]).sub(new Vector3([x2, y2, 0]));
    drawVector(v3, "green");
  } 
  else if (op === "div") {
    if (scalar === 0) {
      alert("Cannot divide by zero!");
      return;
    }
    let v3 = new Vector3([x1, y1, 0]).div(scalar);
    let v4 = new Vector3([x2, y2, 0]).div(scalar);
    drawVector(v3, "green");
    drawVector(v4, "green");
  }
  else if (op === "mul") {
    let v3 = new Vector3([x1, y1, 0]).mul(scalar);
    let v4 = new Vector3([x2, y2, 0]).mul(scalar);
    drawVector(v3, "green");
    drawVector(v4, "green");
  } 
  else if (op === "mag") {
    let mag1 = v1.magnitude();
    let mag2 = v2.magnitude();
    console.log("Magnitude of v1:",mag1);
    console.log("Magnitude of v2:",mag2);
  }
  else if (op === "norm") {
    let v1Normalized = new Vector3([x1, y1, 0]).normalize();
    let v2Normalized = new Vector3([x2, y2, 0]).normalize();
    drawVector(v1Normalized, "green");
    drawVector(v2Normalized, "green");
  }
  else if (op === "angleBetween") {
    angleBetween(v1,v2);
  }
  else if (op === "area") {
    areaTriangle(v1,v2);
  }    
}

function angleBetween(v1,v2){
    let dotProduct = Vector3.dot(v1,v2);
    let mag1 = v1.magnitude();
    let mag2 = v2.magnitude();
    //dot product dot(v1,v2) = ||v1|| * ||v2|| * cos(alpha)
    let cosAlpha = dotProduct / (mag1 * mag2);
    let angleRad = Math.acos(cosAlpha); //radians
    let angleDeg = angleRad * (180/ Math.PI); //rad to degrees
    console.log("Angle:", angleDeg);
}

function areaTriangle(v1,v2){
  let crossProduct = Vector3.cross(v1,v2);
  let area = 0.5 * crossProduct.magnitude();
  console.log("Area of the triangle:", area);
}