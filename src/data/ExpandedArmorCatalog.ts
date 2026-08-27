// Aetheria Expanded Armor & Accessory Master Catalog
// Full registry of armors, helmets, boots, rings, and amulets

export interface CatalogArmor {
  id: string;
  name: string;
  slot: 'armor' | 'helmet' | 'boots' | 'ring' | 'offhand';
  tier: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';
  levelReq: number;
  price: number;
  icon: string;
  stats: {
    str: number;
    int: number;
    agi: number;
    def: number;
    hp: number;
    mp: number;
  };
}

export const CATALOG_ARMORS: CatalogArmor[] = [];

const armorPrefixes = [
  'Guardian', 'Warden', 'Aegis', 'Shadow', 'Arcane', 'Blessed', 'Infernal', 'Glacial', 'Thunder',
  'Celestial', 'Abyssal', 'Titan', 'Ironclad', 'Rune-forged', 'Obsidian', 'Ethereal', 'Sovereign'
];

const armorTypes = ['Chestplate', 'Hauberk', 'Cuirass', 'Vestments', 'Robes', 'Greathelm', 'Hood', 'Circlet', 'Greaves', 'Sabatons', 'Striders', 'Signet', 'Amulet'];

let armorId = 1;

for (let p of armorPrefixes) {
  for (let a of armorTypes) {
    for (let tier = 1; tier <= 5; tier++) {
      const id = `item_arm_cat_${armorId++}`;
      const rarity = tier === 5 ? 'mythic' : tier === 4 ? 'legendary' : tier === 3 ? 'epic' : tier === 2 ? 'rare' : 'uncommon';
      const slot = a === 'Greathelm' || a === 'Hood' || a === 'Circlet' ? 'helmet' : a === 'Greaves' || a === 'Sabatons' || a === 'Striders' ? 'boots' : a === 'Signet' || a === 'Amulet' ? 'ring' : 'armor';

      CATALOG_ARMORS.push({
        id,
        name: `${p} ${a} Tier ${tier}`,
        slot,
        tier,
        rarity,
        levelReq: tier * 8,
        price: tier * 280,
        icon: slot === 'helmet' ? '🪖' : slot === 'boots' ? '👢' : slot === 'ring' ? '💍' : '🛡️',
        stats: {
          str: tier * 6,
          int: tier * 6,
          agi: tier * 5,
          def: tier * 30,
          hp: tier * 150,
          mp: tier * 80
        }
      });
    }
  }
}
