import { Serializer } from './Serializer';

export interface GameSaveData {
  version: string;
  timestamp: number;
  player: {
    level: number;
    hp: number;
    mp: number;
    exp: number;
    position: { x: number; y: number };
  };
  inventory: any[];
  quests: any[];
  mapData?: any;
}

export class SaveManager {
  private static prefix = 'aetheria_save_';

  public static save(slot: string, data: GameSaveData): boolean {
    try {
      const encoded = Serializer.serialize(data);
      localStorage.setItem(SaveManager.prefix + slot, encoded);
      return true;
    } catch (e) {
      console.error(`Failed to save state to slot ${slot}:`, e);
      return false;
    }
  }

  public static load(slot: string): GameSaveData | null {
    try {
      const encoded = localStorage.getItem(SaveManager.prefix + slot);
      if (!encoded) return null;
      return Serializer.deserialize<GameSaveData>(encoded);
    } catch (e) {
      console.error(`Failed to load save slot ${slot}:`, e);
      return null;
    }
  }

  public static deleteSave(slot: string): void {
    localStorage.removeItem(SaveManager.prefix + slot);
  }
}
