export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
export type ItemType = 'weapon' | 'armor' | 'helmet' | 'offhand' | 'boots' | 'ring' | 'potion' | 'material';

export interface Item {
  id: string;
  name: string;
  type: ItemType;
  rarity: ItemRarity;
  icon: string;
  description: string;
  stackable: boolean;
  maxStack: number;
  quantity: number;
  stats?: {
    strength?: number;
    intelligence?: number;
    agility?: number;
    defense?: number;
    attackPower?: number;
    magicPower?: number;
  };
}

export class ItemDatabase {
  public static items: Record<string, Omit<Item, 'quantity'>> = {
    sword_iron: {
      id: 'sword_iron',
      name: 'Iron Broadsword',
      type: 'weapon',
      rarity: 'common',
      icon: '⚔️',
      description: 'A sturdy iron blade standard among adventurers.',
      stackable: false,
      maxStack: 1,
      stats: { strength: 5, attackPower: 12 }
    },
    sword_aether: {
      id: 'sword_aether',
      name: 'Aetherial Blade of Fate',
      type: 'weapon',
      rarity: 'legendary',
      icon: '🗡️',
      description: 'Forged in cosmic fire, imbued with raw Aetherial energy.',
      stackable: false,
      maxStack: 1,
      stats: { strength: 25, intelligence: 15, attackPower: 85 }
    },
    staff_arcane: {
      id: 'staff_arcane',
      name: 'Staff of Arcane Echoes',
      type: 'weapon',
      rarity: 'epic',
      icon: '🪄',
      description: 'Amplifies spellcasting power and elemental mastery.',
      stackable: false,
      maxStack: 1,
      stats: { intelligence: 20, magicPower: 50 }
    },
    potion_health: {
      id: 'potion_health',
      name: 'Greater Health Potion',
      type: 'potion',
      rarity: 'uncommon',
      icon: '🧪',
      description: 'Restores 250 HP instantly upon consumption.',
      stackable: true,
      maxStack: 20
    },
    potion_mana: {
      id: 'potion_mana',
      name: 'Elixir of Mana',
      type: 'potion',
      rarity: 'uncommon',
      icon: '🧪',
      description: 'Restores 150 MP instantly.',
      stackable: true,
      maxStack: 20
    },
    ring_shadow: {
      id: 'ring_shadow',
      name: 'Shadowweaver Ring',
      type: 'ring',
      rarity: 'rare',
      icon: '💍',
      description: 'Grants agility and critical strike chance.',
      stackable: false,
      maxStack: 1,
      stats: { agility: 12, defense: 4 }
    }
  };

  public static createItem(id: string, quantity: number = 1): Item | null {
    const base = ItemDatabase.items[id];
    if (!base) return null;
    return { ...base, quantity };
  }
}
