export type EntityId = number;

export class Entity {
  public readonly id: EntityId;
  public name: string;
  public active: boolean = true;
  public tags: Set<string> = new Set();

  constructor(id: EntityId, name: string = `Entity_${id}`) {
    this.id = id;
    this.name = name;
  }

  public addTag(tag: string): this {
    this.tags.add(tag);
    return this;
  }

  public hasTag(tag: string): boolean {
    return this.tags.has(tag);
  }

  public removeTag(tag: string): this {
    this.tags.delete(tag);
    return this;
  }
}
