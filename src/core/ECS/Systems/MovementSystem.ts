import { System } from '../System';
import { World } from '../World';
import { Query } from '../Query';
import { TransformComponent } from '../Components/TransformComponent';
import { VelocityComponent } from '../Components/VelocityComponent';

export class MovementSystem extends System {
  private query: Query = new Query({
    all: [TransformComponent, VelocityComponent]
  });

  constructor() {
    super();
    this.priority = 10;
  }

  public update(world: World, dt: number): void {
    const entities = world.query(this.query);

    for (let i = 0; i < entities.length; i++) {
      const entity = entities[i];
      const transform = world.getComponent(entity.id, TransformComponent)!;
      const velocity = world.getComponent(entity.id, VelocityComponent)!;

      // Apply velocity to position
      transform.position.x += velocity.velocity.x * dt;
      transform.position.y += velocity.velocity.y * dt;

      // Apply friction decay
      velocity.velocity.x *= velocity.friction;
      velocity.velocity.y *= velocity.friction;

      // Clamp max speed
      const speed = velocity.velocity.length();
      if (speed > velocity.maxSpeed) {
        velocity.velocity.normalize().multiplyScalar(velocity.maxSpeed);
      }
    }
  }
}
