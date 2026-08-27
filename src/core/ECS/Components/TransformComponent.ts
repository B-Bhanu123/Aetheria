import { Component, registerComponent } from '../Component';
import { Vector2 } from '../../../math/Vector2';

@registerComponent
export class TransformComponent extends Component {
  public position: Vector2;
  public scale: Vector2;
  public rotation: number; // In radians

  constructor(x: number = 0, y: number = 0, scaleX: number = 1, scaleY: number = 1, rotation: number = 0) {
    super();
    this.position = new Vector2(x, y);
    this.scale = new Vector2(scaleX, scaleY);
    this.rotation = rotation;
  }
}
