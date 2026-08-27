import { System } from '../System';
import { World } from '../World';
import { Query } from '../Query';
import { TransformComponent } from '../Components/TransformComponent';
import { ColliderComponent } from '../Components/ColliderComponent';
import { Vector2 } from '../../../math/Vector2';

export class PhysicsSystem extends System {
  private query: Query = new Query({
    all: [TransformComponent, ColliderComponent]
  });

  constructor() {
    super();
    this.priority = 20;
  }

  public update(world: World, dt: number): void {
    const entities = world.query(this.query);

    for (let i = 0; i < entities.length; i++) {
      for (let j = i + 1; j < entities.length; j++) {
        const eA = entities[i];
        const eB = entities[j];

        const tA = world.getComponent(eA.id, TransformComponent)!;
        const cA = world.getComponent(eA.id, ColliderComponent)!;
        const tB = world.getComponent(eB.id, TransformComponent)!;
        const cB = world.getComponent(eB.id, ColliderComponent)!;

        if (this.checkAABB(tA.position, cA.width, cA.height, tB.position, cB.width, cB.height)) {
          world.events.emit('collisionDetected', { entityA: eA, entityB: eB });
        }
      }
    }
  }

  private checkAABB(posA: Vector2, wA: number, hA: number, posB: Vector2, wB: number, hB: number): boolean {
    return !(
      posA.x + wA / 2 < posB.x - wB / 2 ||
      posA.x - wA / 2 > posB.x + wB / 2 ||
      posA.y + hA / 2 < posB.y - hB / 2 ||
      posA.y - hA / 2 > posB.y + hB / 2
    );
  }
}
