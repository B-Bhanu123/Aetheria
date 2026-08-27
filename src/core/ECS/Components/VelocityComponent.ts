import { Component, registerComponent } from '../Component';
import { Vector2 } from '../../../math/Vector2';

@registerComponent
export class VelocityComponent extends Component {
  public velocity: Vector2;
  public maxSpeed: number;
  public friction: number;

  constructor(vx: number = 0, vy: number = 0, maxSpeed: number = 500, friction: number = 0.85) {
    super();
    this.velocity = new Vector2(vx, vy);
    this.maxSpeed = maxSpeed;
    this.friction = friction;
  }
}
