import { Component, registerComponent } from '../Component';

@registerComponent
export class RenderComponent extends Component {
  public spriteName: string;
  public width: number;
  public height: number;
  public color: string;
  public zIndex: number;
  public visible: boolean;

  constructor(spriteName: string = 'default', width: number = 32, height: number = 32, color: string = '#00d2ff', zIndex: number = 1) {
    super();
    this.spriteName = spriteName;
    this.width = width;
    this.height = height;
    this.color = color;
    this.zIndex = zIndex;
    this.visible = true;
  }
}
