import { ComponentConstructor } from './Component';
import { EntityId } from './Entity';

export class Query {
  public all: ComponentConstructor[];
  public any: ComponentConstructor[];
  public none: ComponentConstructor[];

  constructor(config: {
    all?: ComponentConstructor[];
    any?: ComponentConstructor[];
    none?: ComponentConstructor[];
  }) {
    this.all = config.all || [];
    this.any = config.any || [];
    this.none = config.none || [];
  }

  public matches(hasComponent: (entityId: EntityId, componentClass: ComponentConstructor) => boolean, entityId: EntityId): boolean {
    for (let i = 0; i < this.all.length; i++) {
      if (!hasComponent(entityId, this.all[i])) return false;
    }

    if (this.any.length > 0) {
      let foundAny = false;
      for (let i = 0; i < this.any.length; i++) {
        if (hasComponent(entityId, this.any[i])) {
          foundAny = true;
          break;
        }
      }
      if (!foundAny) return false;
    }

    for (let i = 0; i < this.none.length; i++) {
      if (hasComponent(entityId, this.none[i])) return false;
    }

    return true;
  }
}
