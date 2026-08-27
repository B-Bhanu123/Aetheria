import { Entity, EntityId } from './Entity';
import { Component, ComponentConstructor } from './Component';
import { System } from './System';
import { Query } from './Query';
import { EventDispatcher } from '../EventDispatcher';

export class World {
  private nextEntityId: EntityId = 1;
  private entities: Map<EntityId, Entity> = new Map();
  private components: Map<ComponentConstructor, Map<EntityId, Component>> = new Map();
  private systems: System[] = [];
  public events: EventDispatcher = new EventDispatcher();

  public createEntity(name?: string): Entity {
    const id = this.nextEntityId++;
    const entity = new Entity(id, name);
    this.entities.set(id, entity);
    this.events.emit('entityCreated', entity);
    return entity;
  }

  public getEntity(id: EntityId): Entity | undefined {
    return this.entities.get(id);
  }

  public destroyEntity(id: EntityId): void {
    const entity = this.entities.get(id);
    if (!entity) return;

    this.components.forEach(componentMap => {
      componentMap.delete(id);
    });

    this.entities.delete(id);
    this.events.emit('entityDestroyed', id);
  }

  public addComponent<T extends Component>(entityId: EntityId, component: T): T {
    const cClass = component.constructor as ComponentConstructor<T>;
    if (!this.components.has(cClass)) {
      this.components.set(cClass, new Map());
    }
    this.components.get(cClass)!.set(entityId, component);
    this.events.emit('componentAdded', { entityId, component });
    return component;
  }

  public getComponent<T extends Component>(entityId: EntityId, componentClass: ComponentConstructor<T>): T | undefined {
    const map = this.components.get(componentClass);
    return map ? (map.get(entityId) as T) : undefined;
  }

  public hasComponent(entityId: EntityId, componentClass: ComponentConstructor): boolean {
    const map = this.components.get(componentClass);
    return map ? map.has(entityId) : false;
  }

  public removeComponent<T extends Component>(entityId: EntityId, componentClass: ComponentConstructor<T>): void {
    const map = this.components.get(componentClass);
    if (map) {
      map.delete(entityId);
      this.events.emit('componentRemoved', { entityId, componentClass });
    }
  }

  public addSystem(system: System): void {
    this.systems.push(system);
    this.systems.sort((a, b) => a.priority - b.priority);
    if (system.init) {
      system.init(this);
    }
  }

  public query(query: Query): Entity[] {
    const results: Entity[] = [];
    const checkFn = (id: EntityId, cls: ComponentConstructor) => this.hasComponent(id, cls);

    this.entities.forEach(entity => {
      if (entity.active && query.matches(checkFn, entity.id)) {
        results.push(entity);
      }
    });

    return results;
  }

  public update(dt: number): void {
    for (let i = 0; i < this.systems.length; i++) {
      const system = this.systems[i];
      if (system.enabled) {
        system.update(this, dt);
      }
    }
  }

  public clear(): void {
    this.systems.forEach(s => s.onDestroy && s.onDestroy(this));
    this.systems = [];
    this.components.clear();
    this.entities.clear();
  }
}
