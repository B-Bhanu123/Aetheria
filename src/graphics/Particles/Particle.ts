import { Vector2 } from '../../math/Vector2';

export class Particle {
  public position: Vector2 = new Vector2();
  public velocity: Vector2 = new Vector2();
  public acceleration: Vector2 = new Vector2();
  public color: string = '#ffffff';
  public size: number = 4;
  public endSize: number = 0;
  public alpha: number = 1.0;
  public life: number = 1.0;
  public maxLife: number = 1.0;
  public active: boolean = false;

  public reset(x: number, y: number, vx: number, vy: number, life: number, color: string, size: number, endSize: number = 0): void {
    this.position.set(x, y);
    this.velocity.set(vx, vy);
    this.acceleration.set(0, 0);
    this.maxLife = life;
    this.life = life;
    this.color = color;
    this.size = size;
    this.endSize = endSize;
    this.alpha = 1.0;
    this.active = true;
  }

  public update(dt: number): void {
    if (!this.active) return;

    this.life -= dt;
    if (this.life <= 0) {
      this.active = false;
      return;
    }

    this.velocity.x += this.acceleration.x * dt;
    this.velocity.y += this.acceleration.y * dt;

    this.position.x += this.velocity.x * dt;
    this.position.y += this.velocity.y * dt;

    const progress = 1 - (this.life / this.maxLife);
    this.alpha = 1 - progress;
  }
}
