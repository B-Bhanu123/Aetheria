import { World } from '../src/core/ECS/World';
import { TransformComponent } from '../src/core/ECS/Components/TransformComponent';
import { VelocityComponent } from '../src/core/ECS/Components/VelocityComponent';
import { Query } from '../src/core/ECS/Query';
import { TestRunner } from './testRunner';

export function runECSTests(): void {
  const suite = 'ECS Framework';

  // Test 4: Entity Component Attachment & Query Matching
  const world = new World();
  const e1 = world.createEntity('Hero');
  world.addComponent(e1.id, new TransformComponent(10, 20));
  world.addComponent(e1.id, new VelocityComponent(5, 5));

  const e2 = world.createEntity('StaticObstacle');
  world.addComponent(e2.id, new TransformComponent(50, 50));

  const query = new Query({ all: [TransformComponent, VelocityComponent] });
  const results = world.query(query);

  TestRunner.assertEqual(results.length, 1, 'ECS Query Entity Count', suite);
  TestRunner.assertEqual(results[0].id, e1.id, 'ECS Query Entity Matching', suite);
}
