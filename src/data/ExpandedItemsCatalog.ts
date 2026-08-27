// Aetheria Complete RPG Item Master Catalog
// Full item registry containing equipment, materials, potions, scrolls, and socket gems

export interface CatalogItem {
  id: string;
  name: string;
  category: 'weapon' | 'armor' | 'helmet' | 'offhand' | 'boots' | 'ring' | 'potion' | 'material' | 'scroll' | 'gem';
  tier: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';
  level: number;
  price: number;
  icon: string;
  description: string;
  stats: {
    str: number;
    int: number;
    agi: number;
    def: number;
    atk: number;
    matk: number;
    crit: number;
  };
  sockets: number;
}

export const CATALOG_ITEMS: CatalogItem[] = [];

const prefixes = [
  'Vanguard', 'Sentinel', 'Arcane', 'Infernal', 'Glacial', 'Storm-born', 'Celestial', 'Abyssal',
  'Bloodbound', 'Shadow-spun', 'Titan', 'Divine', 'Corrupted', 'Obsidian', 'Ethereal', 'Shattered',
  'Radiant', 'Valiant', 'Dreaded', 'Venerable', 'Ancient', 'Mythic', 'Hallowed', 'Luminous'
];

const suffixes = [
  'of Power', 'of Destruction', 'of the Eclipse', 'of Wisdom', 'of the Phoenix', 'of Agility',
  'of the Bear', 'of the Eagle', 'of the Void', 'of Eternity', 'of the Tempest', 'of Resilience',
  'of Fortitude', 'of Transcendence', 'of the Fallen', 'of the Dawn', 'of Shadows', 'of Fire'
];

const weaponTypes = ['Broadsword', 'Greatsword', 'Katana', 'Battleaxe', 'Warhammer', 'Staff', 'Wand', 'Dagger', 'Longbow', 'Crossbow', 'Scythe', 'Halberd', 'Flail', 'Rapier'];

let catalogId = 1;

for (let p of prefixes) {
  for (let s of suffixes) {
    for (let w of weaponTypes) {
      const id = `item_cat_${catalogId++}`;
      const tier = (catalogId % 5) + 1;
      const rarity = tier === 5 ? 'mythic' : tier === 4 ? 'legendary' : tier === 3 ? 'epic' : tier === 2 ? 'rare' : 'uncommon';

      CATALOG_ITEMS.push({
        id,
        name: `${p} ${w} ${s}`,
        category: 'weapon',
        tier,
        rarity,
        level: tier * 10,
        price: tier * 350,
        icon: w === 'Staff' || w === 'Wand' ? '🪄' : w === 'Longbow' || w === 'Crossbow' ? '🏹' : w === 'Dagger' ? '🗡️' : '⚔️',
        description: `A mastercrafted ${w.toLowerCase()} infused with ${p.toLowerCase()} forces.`,
        stats: {
          str: tier * 10,
          int: tier * 8,
          agi: tier * 6,
          def: tier * 3,
          atk: tier * 45,
          matk: tier * 50,
          crit: 0.05 + tier * 0.02
        },
        sockets: tier > 2 ? tier - 1 : 0
      });
    }
  }
}
