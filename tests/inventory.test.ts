import { Inventory } from '../src/gameplay/Items/Inventory';
import { ItemDatabase } from '../src/gameplay/Items/ItemDatabase';
import { TestRunner } from './testRunner';

export function runInventoryTests(): void {
  const suite = 'Inventory System';

  // Test 6: Stacking and Slot Management
  const inv = new Inventory(10);
  const potion = ItemDatabase.createItem('potion_health', 5)!;

  TestRunner.assert(inv.addItem(potion), 'Item Addition to Inventory', suite);
  TestRunner.assertEqual(inv.slots[0]?.quantity, 5, 'Item Quantity Stacking', suite);
}
