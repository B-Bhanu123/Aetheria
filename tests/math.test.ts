import { Vector2 } from '../src/math/Vector2';
import { Vector3 } from '../src/math/Vector3';
import { TestRunner } from './testRunner';

export function runMathTests(): void {
  const suite = 'Math Engine';

  // Test 1: Vector2 Addition & Dot Product
  const v1 = new Vector2(3, 4);
  const v2 = new Vector2(1, 2);
  v1.add(v2);
  TestRunner.assertEqual(v1.x, 4, 'Vector2 Add X', suite);
  TestRunner.assertEqual(v1.y, 6, 'Vector2 Add Y', suite);

  const dot = new Vector2(1, 0).dot(new Vector2(0, 1));
  TestRunner.assertEqual(dot, 0, 'Vector2 Perpendicular Dot Product', suite);

  // Test 2: Vector3 Cross Product
  const v3a = new Vector3(1, 0, 0);
  const v3b = new Vector3(0, 1, 0);
  const cross = v3a.cross(v3b);
  TestRunner.assertEqual(cross.z, 1, 'Vector3 Cross Product Z', suite);
}
