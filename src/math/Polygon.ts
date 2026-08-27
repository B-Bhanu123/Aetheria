import { Vector2 } from './Vector2';

export class Polygon {
  public vertices: Vector2[];

  constructor(vertices: Vector2[] = []) {
    this.vertices = vertices;
  }

  public getCentroid(target: Vector2 = new Vector2()): Vector2 {
    let area = 0;
    let cx = 0;
    let cy = 0;
    const n = this.vertices.length;

    for (let i = 0; i < n; i++) {
      const p1 = this.vertices[i];
      const p2 = this.vertices[(i + 1) % n];
      const cross = p1.x * p2.y - p2.x * p1.y;
      area += cross;
      cx += (p1.x + p2.x) * cross;
      cy += (p1.y + p2.y) * cross;
    }

    area *= 0.5;
    if (area === 0) {
      return target.set(0, 0);
    }
    return target.set(cx / (6 * area), cy / (6 * area));
  }

  public getNormals(): Vector2[] {
    const normals: Vector2[] = [];
    const n = this.vertices.length;

    for (let i = 0; i < n; i++) {
      const p1 = this.vertices[i];
      const p2 = this.vertices[(i + 1) % n];
      const edge = new Vector2(p2.x - p1.x, p2.y - p1.y);
      normals.push(edge.perpendicular().normalize());
    }
    return normals;
  }

  public projectOntoAxis(axis: Vector2): { min: number; max: number } {
    let min = this.vertices[0].dot(axis);
    let max = min;

    for (let i = 1; i < this.vertices.length; i++) {
      const p = this.vertices[i].dot(axis);
      if (p < min) min = p;
      if (p > max) max = p;
    }
    return { min, max };
  }
}
