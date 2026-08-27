import { Vector2 } from './Vector2';
import { Polygon } from './Polygon';

export interface CollisionResult {
  collided: boolean;
  overlap: number;
  overlapAxis: Vector2;
}

export class SAT {
  public static testPolygonPolygon(a: Polygon, b: Polygon): CollisionResult {
    let overlap = Infinity;
    let smallestAxis = new Vector2();

    const normalsA = a.getNormals();
    const normalsB = b.getNormals();
    const axes = [...normalsA, ...normalsB];

    for (let i = 0; i < axes.length; i++) {
      const axis = axes[i];
      const projA = a.projectOntoAxis(axis);
      const projB = b.projectOntoAxis(axis);

      const o = this.getOverlap(projA.min, projA.max, projB.min, projB.max);
      if (o <= 0) {
        return { collided: false, overlap: 0, overlapAxis: new Vector2() };
      }

      if (o < overlap) {
        overlap = o;
        smallestAxis = axis.clone();
      }
    }

    const cA = a.getCentroid();
    const cB = b.getCentroid();
    const dir = new Vector2().subVectors(cB, cA);

    if (dir.dot(smallestAxis) < 0) {
      smallestAxis.multiplyScalar(-1);
    }

    return {
      collided: true,
      overlap,
      overlapAxis: smallestAxis
    };
  }

  private static getOverlap(minA: number, maxA: number, minB: number, maxB: number): number {
    return Math.min(maxA, maxB) - Math.max(minA, minB);
  }
}
