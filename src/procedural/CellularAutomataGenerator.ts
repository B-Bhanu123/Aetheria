import { Random } from '../math/Random';

export class CellularAutomataGenerator {
  public static generateCaves(width: number, height: number, fillProbability: number = 0.45, iterations: number = 5, seed: number = Date.now()): number[][] {
    const rng = new Random(seed);
    let map: number[][] = [];

    // Initialize random map
    for (let x = 0; x < width; x++) {
      map[x] = [];
      for (let y = 0; y < height; y++) {
        if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
          map[x][y] = 0; // Wall border
        } else {
          map[x][y] = rng.nextBool(fillProbability) ? 0 : 1;
        }
      }
    }

    // Run cellular automata smoothing steps
    for (let i = 0; i < iterations; i++) {
      const nextMap: number[][] = [];
      for (let x = 0; x < width; x++) {
        nextMap[x] = [];
        for (let y = 0; y < height; y++) {
          if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
            nextMap[x][y] = 0;
            continue;
          }

          const wallCount = CellularAutomataGenerator.getSurroundingWallCount(map, x, y);

          if (wallCount > 4) {
            nextMap[x][y] = 0;
          } else if (wallCount < 4) {
            nextMap[x][y] = 1;
          } else {
            nextMap[x][y] = map[x][y];
          }
        }
      }
      map = nextMap;
    }

    return map;
  }

  private static getSurroundingWallCount(map: number[][], gridX: number, gridY: number): number {
    let wallCount = 0;
    for (let neighborX = gridX - 1; neighborX <= gridX + 1; neighborX++) {
      for (let neighborY = gridY - 1; neighborY <= gridY + 1; neighborY++) {
        if (neighborX !== gridX || neighborY !== gridY) {
          if (neighborX >= 0 && neighborX < map.length && neighborY >= 0 && neighborY < map[0].length) {
            if (map[neighborX][neighborY] === 0) wallCount++;
          } else {
            wallCount++;
          }
        }
      }
    }
    return wallCount;
  }
}
