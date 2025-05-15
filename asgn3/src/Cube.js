class Cube{
    constructor(){
        this.type='cube';
        //this.position = [0.0,0.0,0.0];
        this.color = [1.0,1.0,1.0,1.0];
        //this.size = 5.0;
        //this.segments = 10;
        this.matrix = new Matrix4();
        this.textureNum=-2;

        this.cubeVert32 = new Float32Array([
            //front
            1,0,0,   0,0,0,  0,1,0, 
            1,0,0,   0,1,0,  1,1,0,
            //top
            0,1,1,   1,1,1,  1,1,0, 
            0,1,1,   1,1,0,  0,1,0,
            //back
            0,0,1,   1,0,1,  1,1,1, 
            0,0,1,   1,1,1,  0,1,1,
            //left
            0,0,0,   0,0,1,  0,1,1, 
            0,0,0,   0,1,1,  0,1,0,
            //right
            1,0,1,   1,0,0,  1,1,0,
            1,0,1,   1,1,0,  1,1,1,   
            //bottom
            1,0,1,   0,0,1,  0,0,0,
            1,0,1,   0,0,0,  1,0,0
        ]);
        this.vertUV = new Float32Array([
        
        0.25,0.25,   0.50,0.25,   0.50,0.50, //front
        0.25,0.25,   0.50,0.50,   .25,0.50,

        0.25,0.5,   0.50,0.50,   0.5,0.75, //top
        0.25,0.5,   0.5,0.75,   0.25,0.75,

        0.75,0.25,   1.0,0.25,   1.0,0.50, //back
        0.75,0.25,   1.0,0.50,   0.75,0.50,

        0.0,0.25,   0.25,0.25,   0.25,0.50, //left
        0.0,0.25,   0.25,0.50,   0.0,0.50,

        0.50,0.25,   0.75,0.25,   0.75,0.50, //right
        0.50,0.25,   0.75,0.50,   0.50,0.50,

        0.25,0.0,   0.5,0,   0.5,0.25, //bottom
        0.25,0.0,   0.5,.25,   0.25,0.25,
        ]);
    }
    render(){
        //var xy = this.position;
        var rgba = this.color;
        //var size = this.size;
        
        //Pass the texture number
        gl.uniform1i(u_whichTexture, this.textureNum);

        // Pass the color of a point to u_FragColor uniform variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        
        //PAss matrix to u_ModelMatrix attribute
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
        
        //front of the cube
        //drawTriangle3D([0.0,0.0,0.0, 1.0,1.0,0.0, 1.0,0.0,0.0]);
        //drawTriangle3D([0.0,0.0,0.0, 0.0,1.0,0.0, 1.0,1.0,0.0]);
        drawTriangle3DUV([0.0,0.0,0.0, 1.0,1.0,0.0, 1.0,0.0,0.0], [0,0, 1,1, 1,0]);
        drawTriangle3DUV([0.0,0.0,0.0, 0.0,1.0,0.0, 1.0,1.0,0.0], [0,0, 0,1, 1,1]);

        // Pass the color of a point to u_FragColor uniformvariable
        //gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);

        //other sides of the cube 

        //top of cube
        drawTriangle3DUV([0.0,1.0,0.0, 0.0,1.0,1.0, 1.0,1.0,1.0], [0,0, 0,1, 1,1]);
        drawTriangle3DUV([0.0,1.0,0.0, 1.0,1.0,1.0, 1.0,1.0,0.0], [0,0, 1,1, 1,0]);

        // Back of the cube
        //gl.uniform4f(u_FragColor, rgba[0]*0.8, rgba[1]*0.8, rgba[2]*0.8, rgba[3]);
        drawTriangle3DUV([0.0,0.0,1.0,  1.0,1.0,1.0,  1.0,0.0,1.0], [0,0, 1,1, 1,0]);
        drawTriangle3DUV([0.0,0.0,1.0,  0.0,1.0,1.0,  1.0,1.0,1.0], [0,0, 0,1, 1,1]);

        // Left side of the cube
        //gl.uniform4f(u_FragColor, rgba[0]*0.7, rgba[1]*0.7, rgba[2]*0.7, rgba[3]);
        drawTriangle3DUV([0.0,0.0,0.0,  0.0,0.0,1.0,  0.0,1.0,1.0], [0,0, 1,0, 1,1]);
        drawTriangle3DUV([0.0,0.0,0.0,  0.0,1.0,1.0,  0.0,1.0,0.0], [0,0, 1,1, 0,1]);

        // Right side of the cube
        //gl.uniform4f(u_FragColor, rgba[0]*0.6, rgba[1]*0.6, rgba[2]*0.6, rgba[3]);
        drawTriangle3DUV([1.0,0.0,0.0,  1.0,1.0,1.0,  1.0,0.0,1.0], [0,0, 1,1, 1,0]);
        drawTriangle3DUV([1.0,0.0,0.0,  1.0,1.0,0.0,  1.0,1.0,1.0], [0,0, 0,1, 1,1]);

        // Bottom of the cube
        //gl.uniform4f(u_FragColor, rgba[0]*0.5, rgba[1]*0.5, rgba[2]*0.5, rgba[3]);
        drawTriangle3DUV([0.0,0.0,0.0,  1.0,0.0,1.0,  1.0,0.0,0.0], [0,0, 1,1, 1,0]);
        drawTriangle3DUV([0.0,0.0,0.0,  0.0,0.0,1.0,  1.0,0.0,1.0], [0,0, 0,1, 1,1]);
    }
    renderFast(){
        //var xy = this.position;
        var rgba = this.color;
        //var size = this.size;
        
        //Pass the texture number
        //gl.uniform1i(u_whichTexture, this.textureNum);

        // Pass the color of a point to u_FragColor uniform variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        
        //PAss matrix to u_ModelMatrix attribute
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        var allverts = [];
        
        //front of the cube
        allverts=allverts.concat([0.0,0.0,0.0, 1.0,1.0,0.0, 1.0,0.0,0.0]);
        allverts=allverts.concat([0.0,0.0,0.0, 0.0,1.0,0.0, 1.0,1.0,0.0]);

        // Pass the color of a point to u_FragColor uniformvariable
        //gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);

        //other sides of the cube 

        //top of cube
        allverts=allverts.concat([0.0,1.0,0.0, 0.0,1.0,1.0, 1.0,1.0,1.0]);
        allverts=allverts.concat([0.0,1.0,0.0, 1.0,1.0,1.0, 1.0,1.0,0.0]);

        // Back of the cube
        //gl.uniform4f(u_FragColor, rgba[0]*0.8, rgba[1]*0.8, rgba[2]*0.8, rgba[3]);
        allverts=allverts.concat([0.0,0.0,1.0,  1.0,1.0,1.0,  1.0,0.0,1.0]);
        allverts=allverts.concat([0.0,0.0,1.0,  0.0,1.0,1.0,  1.0,1.0,1.0]);

        // Left side of the cube
        //gl.uniform4f(u_FragColor, rgba[0]*0.7, rgba[1]*0.7, rgba[2]*0.7, rgba[3]);
        allverts=allverts.concat([0.0,0.0,0.0,  0.0,0.0,1.0,  0.0,1.0,1.0]);
        allverts=allverts.concat([0.0,0.0,0.0,  0.0,1.0,1.0,  0.0,1.0,0.0]);

        // Right side of the cube
        //gl.uniform4f(u_FragColor, rgba[0]*0.6, rgba[1]*0.6, rgba[2]*0.6, rgba[3]);
        allverts=allverts.concat([1.0,0.0,0.0,  1.0,1.0,1.0,  1.0,0.0,1.0]);
        allverts=allverts.concat([1.0,0.0,0.0,  1.0,1.0,0.0,  1.0,1.0,1.0]);

        // Bottom of the cube
        //gl.uniform4f(u_FragColor, rgba[0]*0.5, rgba[1]*0.5, rgba[2]*0.5, rgba[3]);
        allverts=allverts.concat([0.0,0.0,0.0,  1.0,0.0,1.0,  1.0,0.0,0.0]);
        allverts=allverts.concat([0.0,0.0,0.0,  0.0,0.0,1.0,  1.0,0.0,1.0]);

        drawTriangle3D(allverts);
    }
    renderFaster() {
        var rgba = this.color;
        
        // Pass the texture number
        gl.uniform1i(u_whichTexture, this.textureNum);
    
        // Pass the RGBA color
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    
        // Pass the model matrix
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
    
        // Initialize buffer if needed
        if (g_vertexBuffer == null) {
            initTriangleBuffer3D();
        }
    

        // -- Position Buffer --
        let posBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.cubeVert32, gl.STATIC_DRAW);
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);

        // -- UV Buffer --
        let uvBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertUV, gl.STATIC_DRAW);
        gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_UV);

        // Draw the cube (12 triangles = 36 vertices)
        gl.drawArrays(gl.TRIANGLES, 0, 36);
    }
    
}