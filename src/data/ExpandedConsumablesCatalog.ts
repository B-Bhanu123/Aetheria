// Aetheria Consumables & Crafting Materials Master Catalog

export interface ConsumableItem {
  id: string;
  name: string;
  type: 'potion' | 'elixir' | 'scroll' | 'material' | 'rune';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  stackLimit: number;
  effect: {
    type: 'heal_hp' | 'restore_mp' | 'buff_str' | 'buff_int' | 'buff_speed' | 'teleport' | 'crafting';
    amount: number;
    duration: number;
  };
  icon: string;
  description: string;
}

export const CONSUMABLES_CATALOG: ConsumableItem[] = [];

const potionTypes = ['Minor', 'Lesser', 'Standard', 'Greater', 'Superior', 'Grand', 'Supreme', 'Divine', 'Ancient', 'Infinite'];
const statTypes = ['Health', 'Mana', 'Strength', 'Intelligence', 'Agility', 'Defense', 'Speed', 'Critical'];

let consId = 1;

for (let p of potionTypes) {
  for (let s of statTypes) {
    const id = `item_cons_${consId++}`;
    const isHp = s === 'Health';
    const isMp = s === 'Mana';

    CONSUMABLES_CATALOG.push({
      id,
      name: `${p} Potion of ${s}`,
      type: isHp || isMp ? 'potion' : 'elixir',
      rarity: consId % 5 === 0 ? 'legendary' : consId % 4 === 0 ? 'epic' : consId % 3 === 0 ? 'rare' : 'uncommon',
      stackLimit: 99,
      effect: {
        type: isHp ? 'heal_hp' : isMp ? 'restore_mp' : 'buff_str',
        amount: consId * 15,
        duration: isHp || isMp ? 0 : 300
      },
      icon: isHp ? '🧪' : isMp ? '🧪' : '🏺',
      description: `A concentrated ${p.toLowerCase()} alchemy brew restoring or buffing ${s}.`
    });
  }
}
