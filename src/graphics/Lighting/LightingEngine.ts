import { PointLight } from './Light';
import { Camera } from '../Camera';
import { Vector2 } from '../../math/Vector2';

export class LightingEngine {
  public lights: PointLight[] = [];
  public ambientColor: string = 'rgba(10, 12, 20, 0.85)';
  private lightCanvas: HTMLCanvasElement;
  private lightCtx: CanvasRenderingContext2D;

  constructor(width: number, height: number) {
    this.lightCanvas = document.createElement('canvas');
    this.lightCanvas.width = width;
    this.lightCanvas.height = height;
    this.lightCtx = this.lightCanvas.getContext('2d')!;
  }

  public resize(width: number, height: number): void {
    this.lightCanvas.width = width;
    this.lightCanvas.height = height;
  }

  public addLight(light: PointLight): PointLight {
    this.lights.push(light);
    return light;
  }

  public render(mainCtx: CanvasRenderingContext2D, camera: Camera): void {
    const ctx = this.lightCtx;
    const w = this.lightCanvas.width;
    const h = this.lightCanvas.height;

    // Fill ambient darkness
    ctx.fillStyle = this.ambientColor;
    ctx.fillRect(0, 0, w, h);

    ctx.globalCompositeOperation = 'destination-out';

    const screenPos = new Vector2();

    for (let i = 0; i < this.lights.length; i++) {
      const light = this.lights[i];
      camera.worldToScreen(light.position, screenPos);

      const grad = ctx.createRadialGradient(
        screenPos.x, screenPos.y, 0,
        screenPos.x, screenPos.y, light.radius
      );

      grad.addColorStop(0, `rgba(255, 255, 255, ${light.intensity})`);
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(screenPos.x, screenPos.y, light.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalCompositeOperation = 'source-over';

    // Blit lightmap onto main canvas with multiply/overlay blend mode
    mainCtx.save();
    mainCtx.globalCompositeOperation = 'multiply';
    mainCtx.drawImage(this.lightCanvas, 0, 0);
    mainCtx.restore();
  }
}
