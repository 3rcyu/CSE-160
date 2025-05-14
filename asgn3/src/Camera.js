class Camera {
    constructor(canvas) {
      this.fov = 60;
      this.eye = new Vector3([0, 0, 0]);
      this.at = new Vector3([0, 0, -1]);
      this.up = new Vector3([0, 1, 0]);
  
      this.viewMatrix = new Matrix4();
      this.updateView();
  
      this.projectionMatrix = new Matrix4();
      this.projectionMatrix.setPerspective(this.fov, canvas.width / canvas.height, 0.1, 1000);
    }
  
    updateView() {
      this.viewMatrix.setLookAt(
        this.eye.elements[0], this.eye.elements[1], this.eye.elements[2],
        this.at.elements[0], this.at.elements[1], this.at.elements[2],
        this.up.elements[0], this.up.elements[1], this.up.elements[2]
      );
    }
  
    moveForward(speed = 0.2) {
        let f = new Vector3(this.at.elements);
        f.sub(this.eye);
        f.elements[1] = 0; // <-- Ignore vertical component
        f.normalize();
        f.mul(speed);
        this.eye.add(f);
        this.at.add(f);
        this.updateView();
      }
      moveBackwards(speed = 0.2) {
        let b = new Vector3(this.eye.elements);  // b = eye
        b.sub(this.at);                          // b = eye - at
        b.elements[1] = 0;                       // zero out vertical movement
        b.normalize();
        b.mul(speed);
        this.eye.add(b);
        this.at.add(b);
        this.updateView();
      }
      
      
      
  
    moveLeft(speed = 0.2) {
      let f = new Vector3(this.at.elements);
      f = f.sub(this.eye);
      let s = Vector3.cross(this.up, f);
      s.normalize();
      s = s.mul(speed);
      this.eye = this.eye.add(s);
      this.at = this.at.add(s);
      this.updateView();
    }
  
    moveRight(speed = 0.2) {
      let f = new Vector3(this.at.elements);
      f = f.sub(this.eye);
      let s = Vector3.cross(f, this.up);
      s.normalize();
      s = s.mul(speed);
      this.eye = this.eye.add(s);
      this.at = this.at.add(s);
      this.updateView();
    }
  
    panLeft(angle = 3) {
      let f = new Vector3(this.at.elements);
      f = f.sub(this.eye);
      let rotationMatrix = new Matrix4();
      rotationMatrix.setRotate(angle, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
      let f_prime = rotationMatrix.multiplyVector3(f);
      this.at = new Vector3(this.eye.elements);
      this.at = this.at.add(f_prime);
      this.updateView();
    }
  
    panRight(angle = 3) {
      this.panLeft(-angle);
    }

    moveUp(speed = 0.2) {
        let up = new Vector3(this.up.elements);
        up.normalize();
        up.mul(speed);
        this.eye.add(up);
        this.at.add(up);
        this.updateView();
      }
      
      moveDown(speed = 0.2) {
        let down = new Vector3(this.up.elements);
        down.normalize();
        down.mul(speed);
        this.eye.sub(down);
        this.at.sub(down);
        this.updateView();
      }
      

    rotateYaw(pitchDelta, yawDelta) {
        // Step 1: get direction vector
        let dir = new Vector3(this.at.elements);
        dir.sub(this.eye);
        let r = dir.magnitude();
      
        // Step 2: calculate current yaw (theta) and pitch (phi)
        let theta = Math.atan2(dir.elements[2], dir.elements[0]); // yaw (around Y)
        let phi = Math.asin(dir.elements[1] / r);                 // pitch (up/down)
      
        // Step 3: apply deltas
        theta += yawDelta;
        phi += pitchDelta;
      
        // Clamp pitch to avoid flipping
        const limit = Math.PI / 2 - 0.1;
        phi = Math.max(-limit, Math.min(limit, phi));
      
        // Step 4: convert back to direction vector
        dir.elements[0] = r * Math.cos(phi) * Math.cos(theta);
        dir.elements[1] = r * Math.sin(phi);
        dir.elements[2] = r * Math.cos(phi) * Math.sin(theta);
      
        // Step 5: update camera look-at target
        this.at = new Vector3(this.eye.elements); // reset at = eye
        this.at.add(dir);                         // offset direction
        this.updateView();
      }
      
  }