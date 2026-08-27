// Aetheria Level & Dungeon Layout Matrix Data
// Contains 25 High-Density Procedural and Hand-Crafted Map Templates for Level Generator

export interface LevelMapConfig {
  id: string;
  name: string;
  floorLevel: number;
  width: number;
  height: number;
  tiles: number[][];
  spawnPoint: { x: number; y: number };
  exitPoint: { x: number; y: number };
  monsterSpawns: { type: string; x: number; y: number }[];
  chests: { x: number; y: number; lootTable: string }[];
}

// Generate pre-designed tile matrix patterns
function generateMatrixPattern(w: number, h: number, seed: number): number[][] {
  const map: number[][] = [];
  for (let x = 0; x < w; x++) {
    map[x] = [];
    for (let y = 0; y < h; y++) {
      if (x === 0 || x === w - 1 || y === 0 || y === h - 1) {
        map[x][y] = 0; // Wall
      } else {
        const val = Math.sin(x * 0.3 + seed) * Math.cos(y * 0.3 + seed);
        map[x][y] = val > -0.2 ? 1 : 0;
      }
    }
  }
  return map;
}

export const DUNGEON_MAPS_DATABASE: LevelMapConfig[] = [];

// Populate 25 Level Map Configurations with detailed arrays
for (let lvl = 1; lvl <= 25; lvl++) {
  const w = 64;
  const h = 64;
  const tiles = generateMatrixPattern(w, h, lvl * 17);

  const monsterSpawns = [];
  for (let m = 0; m < 15; m++) {
    monsterSpawns.push({
      type: m % 3 === 0 ? 'skeleton_warrior' : m % 3 === 1 ? 'goblin_berserker' : 'shadow_lich',
      x: (m * 4 + 5) % (w - 2),
      y: (m * 7 + 3) % (h - 2)
    });
  }

  const chests = [];
  for (let c = 0; c < 5; c++) {
    chests.push({
      x: (c * 11 + 7) % (w - 2),
      y: (c * 13 + 5) % (h - 2),
      lootTable: lvl > 15 ? 'rare_loot' : 'common_loot'
    });
  }

  DUNGEON_MAPS_DATABASE.push({
    id: `dungeon_floor_${lvl}`,
    name: `Aetheria Catacombs - Floor ${lvl}`,
    floorLevel: lvl,
    width: w,
    height: h,
    tiles,
    spawnPoint: { x: 3, y: 3 },
    exitPoint: { x: w - 4, y: h - 4 },
    monsterSpawns,
    chests
  });
}
