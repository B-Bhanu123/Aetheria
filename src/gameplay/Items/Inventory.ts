import { Item } from './ItemDatabase';

export class Inventory {
  public slots: (Item | null)[];
  public capacity: number;

  constructor(capacity: number = 24) {
    this.capacity = capacity;
    this.slots = new Array(capacity).fill(null);
  }

  public addItem(item: Item): boolean {
    if (item.stackable) {
      for (let i = 0; i < this.slots.length; i++) {
        const slot = this.slots[i];
        if (slot && slot.id === item.id && slot.quantity < slot.maxStack) {
          const space = slot.maxStack - slot.quantity;
          const addAmount = Math.min(space, item.quantity);
          slot.quantity += addAmount;
          item.quantity -= addAmount;
          if (item.quantity <= 0) return true;
        }
      }
    }

    for (let i = 0; i < this.slots.length; i++) {
      if (this.slots[i] === null) {
        this.slots[i] = { ...item };
        return true;
      }
    }

    return false; // Inventory full
  }

  public removeItem(slotIndex: number, amount: number = 1): Item | null {
    if (slotIndex < 0 || slotIndex >= this.capacity) return null;
    const slot = this.slots[slotIndex];
    if (!slot) return null;

    if (slot.quantity > amount) {
      slot.quantity -= amount;
      return { ...slot, quantity: amount };
    } else {
      const removed = slot;
      this.slots[slotIndex] = null;
      return removed;
    }
  }

  public swapSlots(from: number, to: number): void {
    if (from >= 0 && from < this.capacity && to >= 0 && to < this.capacity) {
      const temp = this.slots[from];
      this.slots[from] = this.slots[to];
      this.slots[to] = temp;
    }
  }
}
