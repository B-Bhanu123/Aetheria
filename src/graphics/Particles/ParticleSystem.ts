import { Particle } from './Particle';
import { ParticleEmitter } from './ParticleEmitter';
import { Camera } from '../Camera';
import { Vector2 } from '../../math/Vector2';

export class ParticleSystem {
  public pool: Particle[] = [];
  public emitters: ParticleEmitter[] = [];
  private maxParticles: number;

  constructor(maxParticles: number = 1000) {
    this.maxParticles = maxParticles;
    for (let i = 0; i < maxParticles; i++) {
      this.pool.push(new Particle());
    }
  }

  public createEmitter(x: number, y: number): ParticleEmitter {
    const emitter = new ParticleEmitter(x, y);
    this.emitters.push(emitter);
    return emitter;
  }

  public update(dt: number): void {
    for (let i = 0; i < this.emitters.length; i++) {
      this.emitters[i].update(dt, this.pool);
    }

    for (let i = 0; i < this.pool.length; i++) {
      if (this.pool[i].active) {
        this.pool[i].update(dt);
      }
    }
  }

  public render(ctx: CanvasRenderingContext2D, camera: Camera): void {
    const screenPos = new Vector2();

    for (let i = 0; i < this.pool.length; i++) {
      const p = this.pool[i];
      if (!p.active) continue;

      camera.worldToScreen(p.position, screenPos);

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;

      const size = p.size * (p.life / p.maxLife);
      ctx.beginPath();
      ctx.arc(screenPos.x, screenPos.y, Math.max(1, size), 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }
}
