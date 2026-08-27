import { Serializer } from '../src/save/Serializer';
import { TestRunner } from './testRunner';

export function runSaveStateTests(): void {
  const suite = 'Save State Engine';

  // Test 7: State Serialization & Roundtrip Integrity
  const originalState = { level: 5, hp: 450, name: 'Archmage' };
  const serialized = Serializer.serialize(originalState);
  const deserialized = Serializer.deserialize<typeof originalState>(serialized);

  TestRunner.assertEqual(deserialized?.name, 'Archmage', 'State Roundtrip Integrity Name', suite);
  TestRunner.assertEqual(deserialized?.level, 5, 'State Roundtrip Integrity Level', suite);
}
