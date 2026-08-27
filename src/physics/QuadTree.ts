import { BoundingBox2D } from '../math/BoundingBox';

export interface QuadTreeItem<T> {
  bounds: BoundingBox2D;
  data: T;
}

export class QuadTree<T> {
  private bounds: BoundingBox2D;
  private maxItems: number;
  private maxLevels: number;
  private level: number;
  private items: QuadTreeItem<T>[] = [];
  private nodes: QuadTree<T>[] = [];

  constructor(bounds: BoundingBox2D, maxItems: number = 4, maxLevels: number = 8, level: number = 0) {
    this.bounds = bounds;
    this.maxItems = maxItems;
    this.maxLevels = maxLevels;
    this.level = level;
  }

  public clear(): void {
    this.items = [];
    for (let i = 0; i < this.nodes.length; i++) {
      this.nodes[i].clear();
    }
    this.nodes = [];
  }

  private split(): void {
    const subWidth = (this.bounds.max.x - this.bounds.min.x) / 2;
    const subHeight = (this.bounds.max.y - this.bounds.min.y) / 2;
    const x = this.bounds.min.x;
    const y = this.bounds.min.y;

    this.nodes[0] = new QuadTree(new BoundingBox2D({ x: x + subWidth, y: y }, { x: x + subWidth * 2, y: y + subHeight }), this.maxItems, this.maxLevels, this.level + 1);
    this.nodes[1] = new QuadTree(new BoundingBox2D({ x: x, y: y }, { x: x + subWidth, y: y + subHeight }), this.maxItems, this.maxLevels, this.level + 1);
    this.nodes[2] = new QuadTree(new BoundingBox2D({ x: x, y: y + subHeight }, { x: x + subWidth, y: y + subHeight * 2 }), this.maxItems, this.maxLevels, this.level + 1);
    this.nodes[3] = new QuadTree(new BoundingBox2D({ x: x + subWidth, y: y + subHeight }, { x: x + subWidth * 2, y: y + subHeight * 2 }), this.maxItems, this.maxLevels, this.level + 1);
  }

  public insert(item: QuadTreeItem<T>): void {
    if (this.nodes.length > 0) {
      const index = this.getIndex(item.bounds);
      if (index !== -1) {
        this.nodes[index].insert(item);
        return;
      }
    }

    this.items.push(item);

    if (this.items.length > this.maxItems && this.level < this.maxLevels) {
      if (this.nodes.length === 0) {
        this.split();
      }

      let i = 0;
      while (i < this.items.length) {
        const index = this.getIndex(this.items[i].bounds);
        if (index !== -1) {
          const removed = this.items.splice(i, 1)[0];
          this.nodes[index].insert(removed);
        } else {
          i++;
        }
      }
    }
  }

  public retrieve(returnItems: T[], bounds: BoundingBox2D): T[] {
    const index = this.getIndex(bounds);
    if (index !== -1 && this.nodes.length > 0) {
      this.nodes[index].retrieve(returnItems, bounds);
    } else if (this.nodes.length > 0) {
      for (let i = 0; i < this.nodes.length; i++) {
        this.nodes[i].retrieve(returnItems, bounds);
      }
    }

    for (let i = 0; i < this.items.length; i++) {
      returnItems.push(this.items[i].data);
    }

    return returnItems;
  }

  private getIndex(bounds: BoundingBox2D): number {
    let index = -1;
    const verticalMidpoint = this.bounds.min.x + (this.bounds.max.x - this.bounds.min.x) / 2;
    const horizontalMidpoint = this.bounds.min.y + (this.bounds.max.y - this.bounds.min.y) / 2;

    const topQuadrant = bounds.min.y < horizontalMidpoint && bounds.max.y < horizontalMidpoint;
    const bottomQuadrant = bounds.min.y > horizontalMidpoint;

    if (bounds.min.x < verticalMidpoint && bounds.max.x < verticalMidpoint) {
      if (topQuadrant) index = 1;
      else if (bottomQuadrant) index = 2;
    } else if (bounds.min.x > verticalMidpoint) {
      if (topQuadrant) index = 0;
      else if (bottomQuadrant) index = 3;
    }

    return index;
  }
}
