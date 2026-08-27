import { Vector2 } from '../math/Vector2';
import { BoundingBox2D } from '../math/BoundingBox';

export class SpatialHash<T> {
  private cellSize: number;
  private grid: Map<string, Set<T>> = new Map();

  constructor(cellSize: number = 64) {
    this.cellSize = cellSize;
  }

  private getKey(x: number, y: number): string {
    const cx = Math.floor(x / this.cellSize);
    const cy = Math.floor(y / this.cellSize);
    return `${cx}:${cy}`;
  }

  public clear(): void {
    this.grid.clear();
  }

  public insert(bounds: BoundingBox2D, item: T): void {
    const startX = Math.floor(bounds.min.x / this.cellSize);
    const endX = Math.floor(bounds.max.x / this.cellSize);
    const startY = Math.floor(bounds.min.y / this.cellSize);
    const endY = Math.floor(bounds.max.y / this.cellSize);

    for (let x = startX; x <= endX; x++) {
      for (let y = startY; y <= endY; y++) {
        const key = `${x}:${y}`;
        if (!this.grid.has(key)) {
          this.grid.set(key, new Set());
        }
        this.grid.get(key)!.add(item);
      }
    }
  }

  public query(bounds: BoundingBox2D): Set<T> {
    const results: Set<T> = new Set();
    const startX = Math.floor(bounds.min.x / this.cellSize);
    const endX = Math.floor(bounds.max.x / this.cellSize);
    const startY = Math.floor(bounds.min.y / this.cellSize);
    const endY = Math.floor(bounds.max.y / this.cellSize);

    for (let x = startX; x <= endX; x++) {
      for (let y = startY; y <= endY; y++) {
        const key = `${x}:${y}`;
        const cell = this.grid.get(key);
        if (cell) {
          cell.forEach(item => results.add(item));
        }
      }
    }
    return results;
  }
}
