import { PathGrid } from '../src/ai/Pathfinding/PathGrid';
import { AStar } from '../src/ai/Pathfinding/AStar';
import { Vector2 } from '../src/math/Vector2';
import { TestRunner } from './testRunner';

export function runAITests(): void {
  const suite = 'AI Pathfinding';

  // Test 5: A* Shortest Path Calculation across Grid
  const grid = new PathGrid(10, 10, 32);
  grid.setWalkable(1, 0, false); // Add obstacle

  const start = new Vector2(16, 16);
  const end = new Vector2(80, 16);
  const path = AStar.findPath(grid, start, end);

  TestRunner.assert(path.length > 0, 'A* Path Generation Success', suite);
}
