import { Component, registerComponent } from '../Component';
import { Vector2 } from '../../../math/Vector2';

export type ColliderType = 'box' | 'circle' | 'polygon';

@registerComponent
export class ColliderComponent extends Component {
  public type: ColliderType;
  public width: number;
  public height: number;
  public radius: number;
  public offset: Vector2;
  public isTrigger: boolean;

  constructor(type: ColliderType = 'box', width: number = 32, height: number = 32, radius: number = 16, isTrigger: boolean = false) {
    super();
    this.type = type;
    this.width = width;
    this.height = height;
    this.radius = radius;
    this.offset = new Vector2(0, 0);
    this.isTrigger = isTrigger;
  }
}
