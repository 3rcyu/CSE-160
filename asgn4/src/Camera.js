class Camera {
    constructor(canvas) {
      this.fov = 90;
      this.eye = new Vector3([0, 1.5, 0]);
      this.at = new Vector3([0, 2, -5]);
      this.up = new Vector3([0, 1, 0]);

      this.orbitAngle = 0;
      this.center = new Vector3([0, 1.5, 0]); // center point to orbit around

  
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

      panUp(angle = 3) {
        let f = new Vector3(this.at.elements);
        f = f.sub(this.eye);
      
        let s = Vector3.cross(f, this.up);
        s.normalize();
      
        let rotationMatrix = new Matrix4();
        rotationMatrix.setRotate(angle, s.elements[0], s.elements[1], s.elements[2]);
      
        let f_prime = rotationMatrix.multiplyVector3(f);
        this.at = new Vector3(this.eye.elements).add(f_prime);
        this.updateView();
      }
      
      panDown(angle = 3) {
        this.panUp(-angle);
      }
      
      setOrbitAngle(angleDegrees) {
        this.orbitAngle = angleDegrees;
        let rad = angleDegrees * Math.PI / 180;
        let radius = 4.0;  // distance from center
        this.eye = new Vector3([
          this.center.elements[0] + radius * Math.sin(rad),
          this.center.elements[1],
          this.center.elements[2] + radius * Math.cos(rad),
        ]);
        this.at = new Vector3(this.center.elements);
        this.updateView();
      }
      
  }