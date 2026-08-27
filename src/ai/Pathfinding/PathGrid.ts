export class PathGrid {
  public width: number;
  public height: number;
  public cellSize: number;
  public grid: boolean[][]; // true = walkable, false = blocked

  constructor(width: number, height: number, cellSize: number = 32) {
    this.width = width;
    this.height = height;
    this.cellSize = cellSize;
    this.grid = [];
    for (let x = 0; x < width; x++) {
      this.grid[x] = new Array(height).fill(true);
    }
  }

  public setWalkable(x: number, y: number, walkable: boolean): void {
    if (this.isValid(x, y)) {
      this.grid[x][y] = walkable;
    }
  }

  public isWalkable(x: number, y: number): boolean {
    if (!this.isValid(x, y)) return false;
    return this.grid[x][y];
  }

  public isValid(x: number, y: number): boolean {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }
}
