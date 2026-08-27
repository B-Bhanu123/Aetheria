import { Vector2 } from '../../math/Vector2';

export class PointLight {
  public position: Vector2;
  public radius: number;
  public color: string;
  public intensity: number;

  constructor(x: number = 0, y: number = 0, radius: number = 200, color: string = '#ffffff', intensity: number = 1.0) {
    this.position = new Vector2(x, y);
    this.radius = radius;
    this.color = color;
    this.intensity = intensity;
  }
}
