import { Vector2 } from './Vector2';

export class BoundingCircle {
  public center: Vector2;
  public radius: number;

  constructor(center: Vector2 = new Vector2(), radius: number = 0) {
    this.center = center;
    this.radius = radius;
  }

  public set(center: Vector2, radius: number): this {
    this.center.copy(center);
    this.radius = radius;
    return this;
  }

  public containsPoint(point: Vector2): boolean {
    return this.center.distanceToSq(point) <= this.radius * this.radius;
  }

  public intersectsCircle(circle: BoundingCircle): boolean {
    const rSum = this.radius + circle.radius;
    return this.center.distanceToSq(circle.center) <= rSum * rSum;
  }

  public clone(): BoundingCircle {
    return new BoundingCircle(this.center.clone(), this.radius);
  }
}
