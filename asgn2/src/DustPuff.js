//ai to help create dustpuff and sphere
class DustPuff {
    constructor(x, y, z) {
      this.x = x;
      this.y = y;
      this.z = z;
      this.size = 0.1 + Math.random() * 0.05;
      this.opacity = 1.0;
      this.lifetime = 0;
  
      // Add random horizontal movement
      this.speedX = (Math.random() - 0.5) * 0.005; // small left-right
      this.speedZ = 0.003 + Math.random() * 0.003; // always backwards
    }
  
    update() {
      this.x += this.speedX; // move sideways
      this.z += this.speedZ; // move backward
      this.size *= 1.01; // grow slowly
      this.opacity -= 0.015; // fade a little faster
      this.lifetime += 1.0;
    }
  
    isDead() {
      return this.opacity <= 0;
    }
  }
  