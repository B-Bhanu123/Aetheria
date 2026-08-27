import { Vector2 } from '../../math/Vector2';
import { Particle } from './Particle';

export class ParticleEmitter {
  public position: Vector2 = new Vector2();
  public emitRate: number = 50; // Particles per sec
  private emitTimer: number = 0;
  public active: boolean = true;
  public color: string = '#00d2ff';
  public particleLife: number = 1.0;
  public speed: number = 100;
  public spreadAngle: number = Math.PI * 2;

  constructor(x: number = 0, y: number = 0) {
    this.position.set(x, y);
  }

  public update(dt: number, particlePool: Particle[]): void {
    if (!this.active) return;

    this.emitTimer += dt;
    const interval = 1 / this.emitRate;

    while (this.emitTimer >= interval) {
      this.emitTimer -= interval;
      this.spawnParticle(particlePool);
    }
  }

  private spawnParticle(pool: Particle[]): void {
    for (let i = 0; i < pool.length; i++) {
      if (!pool[i].active) {
        const angle = (Math.random() - 0.5) * this.spreadAngle;
        const vx = Math.cos(angle) * this.speed * (0.8 + Math.random() * 0.4);
        const vy = Math.sin(angle) * this.speed * (0.8 + Math.random() * 0.4);

        pool[i].reset(
          this.position.x,
          this.position.y,
          vx,
          vy,
          this.particleLife * (0.8 + Math.random() * 0.4),
          this.color,
          6,
          0
        );
        break;
      }
    }
  }
}
