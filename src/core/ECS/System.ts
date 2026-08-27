import { World } from './World';

export abstract class System {
  public priority: number = 0;
  public enabled: boolean = true;

  public abstract update(world: World, dt: number): void;
  public init?(world: World): void;
  public onDestroy?(world: World): void;
}
