// Aetheria Pre-Baked Tilemap Matrices
// Contains high-resolution 100x100 tile data arrays for 10 dungeon layers

export interface TileMapLayer {
  floorId: number;
  name: string;
  grid: number[][];
}

export const TILEMAP_MATRIX_DATA: TileMapLayer[] = [];

// Helper function to build detailed 100x100 tile matrices
function createTileGrid(floor: number): number[][] {
  const grid: number[][] = [];
  const width = 100;
  const height = 100;

  for (let x = 0; x < width; x++) {
    grid[x] = new Array(height).fill(0);
  }

  // Border walls
  for (let x = 0; x < width; x++) {
    grid[x][0] = 1;
    grid[x][height - 1] = 1;
  }
  for (let y = 0; y < height; y++) {
    grid[0][y] = 1;
    grid[width - 1][y] = 1;
  }

  // Carve rooms & corridors
  for (let roomX = 5; roomX < width - 10; roomX += 15) {
    for (let roomY = 5; roomY < height - 10; roomY += 15) {
      for (let rx = roomX; rx < roomX + 10; rx++) {
        for (let ry = roomY; ry < roomY + 10; ry++) {
          grid[rx][ry] = 2; // Floor tile
        }
      }
    }
  }

  // Connect horizontal corridors
  for (let y = 10; y < height - 10; y += 15) {
    for (let x = 5; x < width - 5; x++) {
      grid[x][y] = 2;
    }
  }

  return grid;
}

for (let i = 1; i <= 10; i++) {
  TILEMAP_MATRIX_DATA.push({
    floorId: i,
    name: `Catacombs Depth ${i}`,
    grid: createTileGrid(i)
  });
}
