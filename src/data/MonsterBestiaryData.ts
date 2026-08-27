// Aetheria Monster Bestiary Data
// 100+ Monster Definitions, AI Profiles & Loot Table Probabilities

export interface MonsterProfile {
  id: string;
  name: string;
  category: 'undead' | 'beast' | 'demon' | 'elemental' | 'humanoid' | 'boss';
  level: number;
  maxHp: number;
  maxMp: number;
  attackPower: number;
  defense: number;
  speed: number;
  expReward: number;
  goldReward: { min: number; max: number };
  aiType: 'aggressive' | 'patrol' | 'defensive' | 'boss';
  elementalResistances: Record<string, number>;
  lootTable: { itemId: string; dropChance: number }[];
  icon: string;
}

export const MONSTER_BESTIARY: Record<string, MonsterProfile> = {};

const monsterPrefixes = ['Corrupted', 'Dread', 'Ancient', 'Vile', 'Shadowed', 'Venomous', 'Fiendish', 'Enraged', 'Spectral', 'Infernal'];
const monsterSpecies = ['Skeleton', 'Goblin', 'Orc', 'Lich', 'Demon', 'Gargoyle', 'Drake', 'Golem', 'Wraith', 'Hydra'];

let mIdCounter = 1;

for (let p of monsterPrefixes) {
  for (let s of monsterSpecies) {
    const id = `mob_${p.toLowerCase()}_${s.toLowerCase()}_${mIdCounter++}`;
    const level = (mIdCounter % 50) + 1;
    const isBoss = s === 'Demon' || s === 'Drake' || s === 'Hydra';

    MONSTER_BESTIARY[id] = {
      id,
      name: `${p} ${s}`,
      category: isBoss ? 'boss' : s === 'Skeleton' || s === 'Wraith' ? 'undead' : 'demon',
      level,
      maxHp: isBoss ? level * 250 : level * 45,
      maxMp: level * 20,
      attackPower: level * 8,
      defense: level * 4,
      speed: 120 + level * 2,
      expReward: isBoss ? level * 200 : level * 25,
      goldReward: { min: level * 5, max: level * 20 },
      aiType: isBoss ? 'boss' : 'aggressive',
      elementalResistances: {
        fire: s === 'Demon' ? 0.8 : 0.0,
        ice: s === 'Drake' ? 0.5 : 0.0,
        holy: s === 'Skeleton' ? -0.5 : 0.0
      },
      lootTable: [
        { itemId: 'potion_health', dropChance: 0.4 },
        { itemId: 'potion_mana', dropChance: 0.3 },
        { itemId: 'sword_iron', dropChance: 0.15 }
      ],
      icon: isBoss ? '🐉' : s === 'Skeleton' ? '💀' : s === 'Goblin' ? '👺' : '👾'
    };
  }
}
