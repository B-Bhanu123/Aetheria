export class Vector2 {
  public x: number;
  public y: number;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  public set(x: number, y: number): this {
    this.x = x;
    this.y = y;
    return this;
  }

  public copy(v: Vector2): this {
    this.x = v.x;
    this.y = v.y;
    return this;
  }

  public clone(): Vector2 {
    return new Vector2(this.x, this.y);
  }

  public add(v: Vector2): this {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  public addVectors(a: Vector2, b: Vector2): this {
    this.x = a.x + b.x;
    this.y = a.y + b.y;
    return this;
  }

  public addScalar(s: number): this {
    this.x += s;
    this.y += s;
    return this;
  }

  public sub(v: Vector2): this {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  public subVectors(a: Vector2, b: Vector2): this {
    this.x = a.x - b.x;
    this.y = a.y - b.y;
    return this;
  }

  public multiply(v: Vector2): this {
    this.x *= v.x;
    this.y *= v.y;
    return this;
  }

  public multiplyScalar(s: number): this {
    this.x *= s;
    this.y *= s;
    return this;
  }

  public divide(v: Vector2): this {
    this.x /= v.x;
    this.y /= v.y;
    return this;
  }

  public divideScalar(s: number): this {
    if (s !== 0) {
      this.x /= s;
      this.y /= s;
    } else {
      this.x = 0;
      this.y = 0;
    }
    return this;
  }

  public dot(v: Vector2): number {
    return this.x * v.x + this.y * v.y;
  }

  public cross(v: Vector2): number {
    return this.x * v.y - this.y * v.x;
  }

  public lengthSq(): number {
    return this.x * this.x + this.y * this.y;
  }

  public length(): number {
    return Math.sqrt(this.lengthSq());
  }

  public normalize(): this {
    return this.divideScalar(this.length() || 1);
  }

  public angle(): number {
    return Math.atan2(this.y, this.x);
  }

  public angleTo(v: Vector2): number {
    const denominator = Math.sqrt(this.lengthSq() * v.lengthSq());
    if (denominator === 0) return Math.PI / 2;
    const theta = this.dot(v) / denominator;
    return Math.acos(Math.max(-1, Math.min(1, theta)));
  }

  public distanceToSq(v: Vector2): number {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    return dx * dx + dy * dy;
  }

  public distanceTo(v: Vector2): number {
    return Math.sqrt(this.distanceToSq(v));
  }

  public lerp(v: Vector2, alpha: number): this {
    this.x += (v.x - this.x) * alpha;
    this.y += (v.y - this.y) * alpha;
    return this;
  }

  public rotateAround(center: Vector2, angle: number): this {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    const x = this.x - center.x;
    const y = this.y - center.y;

    this.x = x * c - y * s + center.x;
    this.y = x * s + y * c + center.y;
    return this;
  }

  public rotate(angle: number): this {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    const x = this.x;
    const y = this.y;

    this.x = x * c - y * s;
    this.y = x * s + y * c;
    return this;
  }

  public perpendicular(): Vector2 {
    return new Vector2(-this.y, this.x);
  }

  public reflect(normal: Vector2): this {
    const d = 2 * this.dot(normal);
    this.x -= d * normal.x;
    this.y -= d * normal.y;
    return this;
  }

  public equals(v: Vector2, epsilon: number = 0.00001): boolean {
    return Math.abs(this.x - v.x) < epsilon && Math.abs(this.y - v.y) < epsilon;
  }

  public static zero(): Vector2 {
    return new Vector2(0, 0);
  }

  public static one(): Vector2 {
    return new Vector2(1, 1);
  }

  public static up(): Vector2 {
    return new Vector2(0, -1);
  }

  public static down(): Vector2 {
    return new Vector2(0, 1);
  }

  public static left(): Vector2 {
    return new Vector2(-1, 0);
  }

  public static right(): Vector2 {
    return new Vector2(1, 0);
  }
}
