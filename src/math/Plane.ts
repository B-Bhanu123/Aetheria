import { Vector3 } from './Vector3';

export class Plane {
  public normal: Vector3;
  public constant: number;

  constructor(normal: Vector3 = new Vector3(0, 1, 0), constant: number = 0) {
    this.normal = normal;
    this.constant = constant;
  }

  public setComponents(x: number, y: number, z: number, w: number): this {
    this.normal.set(x, y, z);
    this.constant = w;
    return this;
  }

  public setFromNormalAndCoplanarPoint(normal: Vector3, point: Vector3): this {
    this.normal.copy(normal);
    this.constant = -point.dot(this.normal);
    return this;
  }

  public normalize(): this {
    const inverseNormalLength = 1.0 / this.normal.length();
    this.normal.multiplyScalar(inverseNormalLength);
    this.constant *= inverseNormalLength;
    return this;
  }

  public distanceToPoint(point: Vector3): number {
    return this.normal.dot(point) + this.constant;
  }

  public projectPoint(point: Vector3, target: Vector3 = new Vector3()): Vector3 {
    return target.copy(this.normal).multiplyScalar(-this.distanceToPoint(point)).add(point);
  }
}
