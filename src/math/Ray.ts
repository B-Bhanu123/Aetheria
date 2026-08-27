import { Vector3 } from './Vector3';
import { Vector2 } from './Vector2';

export class Ray {
  public origin: Vector3;
  public direction: Vector3;

  constructor(origin: Vector3 = new Vector3(), direction: Vector3 = new Vector3(0, 0, -1)) {
    this.origin = origin;
    this.direction = direction.normalize();
  }

  public set(origin: Vector3, direction: Vector3): this {
    this.origin.copy(origin);
    this.direction.copy(direction).normalize();
    return this;
  }

  public at(t: number, target: Vector3 = new Vector3()): Vector3 {
    return target.copy(this.direction).multiplyScalar(t).add(this.origin);
  }

  public intersectsSphere(center: Vector3, radius: number): boolean {
    const v = new Vector3().subVectors(center, this.origin);
    const proj = v.dot(this.direction);
    if (proj < 0) return false;

    const dSq = v.lengthSq() - proj * proj;
    return dSq <= radius * radius;
  }

  public intersectsBox2D(min: Vector2, max: Vector2, origin2D: Vector2, dir2D: Vector2): number | null {
    let tmin = (min.x - origin2D.x) / (dir2D.x || 0.00001);
    let tmax = (max.x - origin2D.x) / (dir2D.x || 0.00001);

    if (tmin > tmax) [tmin, tmax] = [tmax, tmin];

    let tymin = (min.y - origin2D.y) / (dir2D.y || 0.00001);
    let tymax = (max.y - origin2D.y) / (dir2D.y || 0.00001);

    if (tymin > tymax) [tymin, tymax] = [tymax, tymin];

    if (tmin > tymax || tymin > tmax) return null;

    if (tymin > tmin) tmin = tymin;
    if (tymax < tmax) tmax = tymax;

    return tmin >= 0 ? tmin : (tmax >= 0 ? tmax : null);
  }
}
