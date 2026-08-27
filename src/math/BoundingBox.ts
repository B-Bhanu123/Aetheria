import { Vector2 } from './Vector2';

export class BoundingBox2D {
  public min: Vector2;
  public max: Vector2;

  constructor(min: Vector2 = new Vector2(Infinity, Infinity), max: Vector2 = new Vector2(-Infinity, -Infinity)) {
    this.min = min;
    this.max = max;
  }

  public set(min: Vector2, max: Vector2): this {
    this.min.copy(min);
    this.max.copy(max);
    return this;
  }

  public setFromPoints(points: Vector2[]): this {
    this.makeEmpty();
    for (let i = 0; i < points.length; i++) {
      this.expandByPoint(points[i]);
    }
    return this;
  }

  public makeEmpty(): this {
    this.min.x = this.min.y = Infinity;
    this.max.x = this.max.y = -Infinity;
    return this;
  }

  public isEmpty(): boolean {
    return this.max.x < this.min.x || this.max.y < this.min.y;
  }

  public getCenter(target: Vector2 = new Vector2()): Vector2 {
    return target.addVectors(this.min, this.max).multiplyScalar(0.5);
  }

  public getSize(target: Vector2 = new Vector2()): Vector2 {
    return target.subVectors(this.max, this.min);
  }

  public expandByPoint(point: Vector2): this {
    this.min.x = Math.min(this.min.x, point.x);
    this.min.y = Math.min(this.min.y, point.y);
    this.max.x = Math.max(this.max.x, point.x);
    this.max.y = Math.max(this.max.y, point.y);
    return this;
  }

  public expandByScalar(s: number): this {
    this.min.x -= s;
    this.min.y -= s;
    this.max.x += s;
    this.max.y += s;
    return this;
  }

  public containsPoint(point: Vector2): boolean {
    return point.x >= this.min.x && point.x <= this.max.x &&
           point.y >= this.min.y && point.y <= this.max.y;
  }

  public intersectsBox(box: BoundingBox2D): boolean {
    return !(box.max.x < this.min.x || box.min.x > this.max.x ||
             box.max.y < this.min.y || box.min.y > this.max.y);
  }

  public clone(): BoundingBox2D {
    return new BoundingBox2D(this.min.clone(), this.max.clone());
  }
}
