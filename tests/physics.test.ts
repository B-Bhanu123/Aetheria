import { BoundingBox2D } from '../src/math/BoundingBox';
import { Vector2 } from '../src/math/Vector2';
import { TestRunner } from './testRunner';

export function runPhysicsTests(): void {
  const suite = 'Physics Engine';

  // Test 3: AABB Intersection Test
  const boxA = new BoundingBox2D(new Vector2(0, 0), new Vector2(32, 32));
  const boxB = new BoundingBox2D(new Vector2(16, 16), new Vector2(48, 48));
  const boxC = new BoundingBox2D(new Vector2(100, 100), new Vector2(150, 150));

  TestRunner.assert(boxA.intersectsBox(boxB), 'AABB Overlap Detection', suite);
  TestRunner.assert(!boxA.intersectsBox(boxC), 'AABB Non-Overlap Detection', suite);
}
