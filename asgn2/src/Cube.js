class Cube{
    constructor(){
        this.type='cube';
        //this.position = [0.0,0.0,0.0];
        this.color = [1.0,1.0,1.0,1.0];
        //this.size = 5.0;
        //this.segments = 10;
        this.matrix = new Matrix4();
    }
    render(){
        //var xy = this.position;
        var rgba = this.color;
        //var size = this.size;

        // Pass the color of a point to u_FragColor uniform variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        
        //PAss matrix to u_ModelMatrix attribute
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
        
        //front of the cube
        drawTriangle3D([0.0,0.0,0.0, 1.0,1.0,0.0, 1.0,0.0,0.0]);
        drawTriangle3D([0.0,0.0,0.0, 0.0,1.0,0.0, 1.0,1.0,0.0]);

        // Pass the color of a point to u_FragColor uniformvariable
        gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);

        //other sides of the cube 

        //top of cube
        drawTriangle3D([0.0,1.0,0.0, 0.0,1.0,1.0, 1.0,1.0,1.0]);
        drawTriangle3D([0.0,1.0,0.0, 1.0,1.0,1.0, 1.0,1.0,0.0]);

        // Back of the cube
        gl.uniform4f(u_FragColor, rgba[0]*0.8, rgba[1]*0.8, rgba[2]*0.8, rgba[3]);
        drawTriangle3D([0.0,0.0,1.0,  1.0,1.0,1.0,  1.0,0.0,1.0]);
        drawTriangle3D([0.0,0.0,1.0,  0.0,1.0,1.0,  1.0,1.0,1.0]);

        // Left side of the cube
        gl.uniform4f(u_FragColor, rgba[0]*0.7, rgba[1]*0.7, rgba[2]*0.7, rgba[3]);
        drawTriangle3D([0.0,0.0,0.0,  0.0,0.0,1.0,  0.0,1.0,1.0]);
        drawTriangle3D([0.0,0.0,0.0,  0.0,1.0,1.0,  0.0,1.0,0.0]);

        // Right side of the cube
        gl.uniform4f(u_FragColor, rgba[0]*0.6, rgba[1]*0.6, rgba[2]*0.6, rgba[3]);
        drawTriangle3D([1.0,0.0,0.0,  1.0,1.0,1.0,  1.0,0.0,1.0]);
        drawTriangle3D([1.0,0.0,0.0,  1.0,1.0,0.0,  1.0,1.0,1.0]);

        // Bottom of the cube
        gl.uniform4f(u_FragColor, rgba[0]*0.5, rgba[1]*0.5, rgba[2]*0.5, rgba[3]);
        drawTriangle3D([0.0,0.0,0.0,  1.0,0.0,1.0,  1.0,0.0,0.0]);
        drawTriangle3D([0.0,0.0,0.0,  0.0,0.0,1.0,  1.0,0.0,1.0]);
    }
}