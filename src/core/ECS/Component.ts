export interface ComponentConstructor<T extends Component = Component> {
  new (...args: any[]): T;
  typeId?: number;
}

export abstract class Component {
  public static typeId: number = -1;
}

let nextTypeId = 0;
export function registerComponent<T extends ComponentConstructor>(target: T): T {
  target.typeId = nextTypeId++;
  return target;
}
