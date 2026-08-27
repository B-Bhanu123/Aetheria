import { Vector2 } from '../math/Vector2';
import { BoundingBox2D } from '../math/BoundingBox';

export class Camera {
  public position: Vector2;
  public target: Vector2 | null = null;
  public viewportSize: Vector2;
  public zoom: number = 1.0;
  public lerpSpeed: number = 5.0;
  public shakeDuration: number = 0;
  public shakeIntensity: number = 0;
  public offset: Vector2 = new Vector2();

  constructor(width: number, height: number) {
    this.position = new Vector2(0, 0);
    this.viewportSize = new Vector2(width, height);
  }

  public update(dt: number): void {
    if (this.target) {
      this.position.lerp(this.target, Math.min(1.0, this.lerpSpeed * dt));
    }

    if (this.shakeDuration > 0) {
      this.shakeDuration -= dt;
      this.offset.set(
        (Math.random() - 0.5) * 2 * this.shakeIntensity,
        (Math.random() - 0.5) * 2 * this.shakeIntensity
      );
      if (this.shakeDuration <= 0) {
        this.offset.set(0, 0);
      }
    }
  }

  public shake(duration: number = 0.3, intensity: number = 10): void {
    this.shakeDuration = duration;
    this.shakeIntensity = intensity;
  }

  public getViewportBounds(): BoundingBox2D {
    const halfW = (this.viewportSize.x / 2) / this.zoom;
    const halfH = (this.viewportSize.y / 2) / this.zoom;
    const min = new Vector2(this.position.x - halfW, this.position.y - halfH);
    const max = new Vector2(this.position.x + halfW, this.position.y + halfH);
    return new BoundingBox2D(min, max);
  }

  public worldToScreen(worldPos: Vector2, target: Vector2 = new Vector2()): Vector2 {
    const halfW = this.viewportSize.x / 2;
    const halfH = this.viewportSize.y / 2;

    target.x = (worldPos.x - this.position.x + this.offset.x) * this.zoom + halfW;
    target.y = (worldPos.y - this.position.y + this.offset.y) * this.zoom + halfH;
    return target;
  }

  public screenToWorld(screenPos: Vector2, target: Vector2 = new Vector2()): Vector2 {
    const halfW = this.viewportSize.x / 2;
    const halfH = this.viewportSize.y / 2;

    target.x = (screenPos.x - halfW) / this.zoom + this.position.x - this.offset.x;
    target.y = (screenPos.y - halfH) / this.zoom + this.position.y - this.offset.y;
    return target;
  }
}
