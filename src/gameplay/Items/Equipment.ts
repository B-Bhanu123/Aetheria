import { Item, ItemType } from './ItemDatabase';

export class Equipment {
  public slots: Record<ItemType, Item | null> = {
    weapon: null,
    offhand: null,
    helmet: null,
    armor: null,
    boots: null,
    ring: null,
    potion: null,
    material: null
  };

  public equip(item: Item): Item | null {
    const slotType = item.type;
    const oldItem = this.slots[slotType];
    this.slots[slotType] = item;
    return oldItem;
  }

  public unequip(type: ItemType): Item | null {
    const item = this.slots[type];
    this.slots[type] = null;
    return item;
  }

  public getTotalStats(): { strength: number; intelligence: number; agility: number; defense: number; attackPower: number; magicPower: number } {
    const total = { strength: 0, intelligence: 0, agility: 0, defense: 0, attackPower: 0, magicPower: 0 };

    Object.values(this.slots).forEach(item => {
      if (item && item.stats) {
        total.strength += item.stats.strength || 0;
        total.intelligence += item.stats.intelligence || 0;
        total.agility += item.stats.agility || 0;
        total.defense += item.stats.defense || 0;
        total.attackPower += item.stats.attackPower || 0;
        total.magicPower += item.stats.magicPower || 0;
      }
    });

    return total;
  }
}
