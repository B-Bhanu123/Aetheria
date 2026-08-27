import { Vector2 } from '../math/Vector2';

export type ToolMode = 'paint' | 'erase' | 'entity' | 'trigger';

export interface MapData {
  width: number;
  height: number;
  tileSize: number;
  tiles: number[][];
  entities: { id: string; type: string; x: number; y: number }[];
  triggers: { id: string; x: number; y: number; width: number; height: number; event: string }[];
}

export class LevelEditor {
  public activeTool: ToolMode = 'paint';
  public selectedTileId: number = 1;
  public mapData: MapData;

  constructor(width: number = 50, height: number = 50, tileSize: number = 32) {
    this.mapData = {
      width,
      height,
      tileSize,
      tiles: [],
      entities: [],
      triggers: []
    };

    for (let x = 0; x < width; x++) {
      this.mapData.tiles[x] = new Array(height).fill(0);
    }
  }

  public paintTile(gridX: number, gridY: number, tileId: number = this.selectedTileId): void {
    if (this.isValid(gridX, gridY)) {
      this.mapData.tiles[gridX][gridY] = tileId;
    }
  }

  public eraseTile(gridX: number, gridY: number): void {
    if (this.isValid(gridX, gridY)) {
      this.mapData.tiles[gridX][gridY] = 0;
    }
  }

  public placeEntity(type: string, worldPos: Vector2): void {
    this.mapData.entities.push({
      id: `entity_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      type,
      x: worldPos.x,
      y: worldPos.y
    });
  }

  public exportJSON(): string {
    return JSON.stringify(this.mapData, null, 2);
  }

  public importJSON(jsonString: string): boolean {
    try {
      this.mapData = JSON.parse(jsonString);
      return true;
    } catch (e) {
      console.error('Failed to import level editor JSON:', e);
      return false;
    }
  }

  private isValid(x: number, y: number): boolean {
    return x >= 0 && x < this.mapData.width && y >= 0 && y < this.mapData.height;
  }
}
