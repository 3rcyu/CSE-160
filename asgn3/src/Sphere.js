//ai to help create dustpuff and sphere
class Sphere {
    constructor(segments = 12) {
      this.type = 'sphere';
      this.color = [1.0, 1.0, 1.0, 1.0];
      this.matrix = new Matrix4();
      this.segments = segments;
    }
  
    render() {
       //var xy = this.position;
       var rgba = this.color;
       //var size = this.size;
       gl.uniform1i(u_whichTexture, -2);
       // Pass the color of a point to u_FragColor uniform variable
       gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
       
       //PAss matrix to u_ModelMatrix attribute
       gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
       drawSphere3D(this.segments);
    }
  }
let sphereVertexBuffer = null;
let sphereVertexData = null;
let sphereVertexCount = 0;

function generateSphereVertices(segments) {
  const verts = [];
  for (let lat = 0; lat <= segments; lat++) {
    const theta = lat * Math.PI / segments;
    const sinTheta = Math.sin(theta);
    const cosTheta = Math.cos(theta);

    for (let lon = 0; lon <= segments; lon++) {
      const phi = lon * 2 * Math.PI / segments;
      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);

      const x = cosPhi * sinTheta;
      const y = cosTheta;
      const z = sinPhi * sinTheta;

      verts.push(x * 0.5 + 0.5, y * 0.5 + 0.5, z * 0.5 + 0.5); // normalize to unit cube
    }
  }

  const indices = [];
  for (let lat = 0; lat < segments; lat++) {
    for (let lon = 0; lon < segments; lon++) {
      const first = (lat * (segments + 1)) + lon;
      const second = first + segments + 1;

      // Two triangles per quad
      indices.push(first, second, first + 1);
      indices.push(second, second + 1, first + 1);
    }
  }

  const finalVerts = [];
  for (let i = 0; i < indices.length; i++) {
    const idx = indices[i];
    finalVerts.push(verts[idx * 3], verts[idx * 3 + 1], verts[idx * 3 + 2]);
  }

  return finalVerts;
}

function drawSphere3D(segments = 12) {
  // Generate and bind sphere vertex buffer if needed
  if (!sphereVertexBuffer || !sphereVertexData || sphereVertexData.segments !== segments) {
    const verts = generateSphereVertices(segments);
    sphereVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
    sphereVertexCount = verts.length / 3;
    sphereVertexData = { segments };
  } else {
    gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexBuffer);
  }

  // ✅ Disable a_UV — sphere doesn't use UVs
  if (a_UV !== -1) gl.disableVertexAttribArray(a_UV);

  // ✅ Enable only a_Position
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);

  // Draw the sphere
  gl.drawArrays(gl.TRIANGLES, 0, sphereVertexCount);
}


