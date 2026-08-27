import { PathGrid } from './PathGrid';
import { Vector2 } from '../../math/Vector2';

export interface PathNode {
  x: number;
  y: number;
  g: number;
  h: number;
  f: number;
  parent: PathNode | null;
}

export class AStar {
  public static findPath(grid: PathGrid, start: Vector2, end: Vector2): Vector2[] {
    const startX = Math.floor(start.x / grid.cellSize);
    const startY = Math.floor(start.y / grid.cellSize);
    const endX = Math.floor(end.x / grid.cellSize);
    const endY = Math.floor(end.y / grid.cellSize);

    if (!grid.isWalkable(startX, startY) || !grid.isWalkable(endX, endY)) {
      return [];
    }

    const openList: PathNode[] = [];
    const closedSet: Set<string> = new Set();

    const startNode: PathNode = {
      x: startX,
      y: startY,
      g: 0,
      h: AStar.heuristic(startX, startY, endX, endY),
      f: 0,
      parent: null
    };
    startNode.f = startNode.g + startNode.h;

    openList.push(startNode);

    while (openList.length > 0) {
      // Get lowest F score node
      openList.sort((a, b) => a.f - b.f);
      const current = openList.shift()!;

      if (current.x === endX && current.y === endY) {
        return AStar.reconstructPath(current, grid.cellSize);
      }

      const key = `${current.x}:${current.y}`;
      closedSet.add(key);

      const neighbors = AStar.getNeighbors(grid, current);

      for (let i = 0; i < neighbors.length; i++) {
        const neighbor = neighbors[i];
        const nKey = `${neighbor.x}:${neighbor.y}`;

        if (closedSet.has(nKey)) continue;

        const tentativeG = current.g + ((neighbor.x !== current.x && neighbor.y !== current.y) ? 1.414 : 1.0);

        const existing = openList.find(n => n.x === neighbor.x && n.y === neighbor.y);

        if (!existing) {
          neighbor.g = tentativeG;
          neighbor.h = AStar.heuristic(neighbor.x, neighbor.y, endX, endY);
          neighbor.f = neighbor.g + neighbor.h;
          neighbor.parent = current;
          openList.push(neighbor);
        } else if (tentativeG < existing.g) {
          existing.g = tentativeG;
          existing.f = existing.g + existing.h;
          existing.parent = current;
        }
      }
    }

    return [];
  }

  private static heuristic(x1: number, y1: number, x2: number, y2: number): number {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2); // Manhattan distance
  }

  private static getNeighbors(grid: PathGrid, node: PathNode): PathNode[] {
    const neighbors: PathNode[] = [];
    const dirs = [
      { x: 0, y: -1 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 0 },
      { x: -1, y: -1 }, { x: 1, y: -1 }, { x: 1, y: 1 }, { x: -1, y: 1 }
    ];

    for (let i = 0; i < dirs.length; i++) {
      const nx = node.x + dirs[i].x;
      const ny = node.y + dirs[i].y;

      if (grid.isWalkable(nx, ny)) {
        neighbors.push({ x: nx, y: ny, g: 0, h: 0, f: 0, parent: null });
      }
    }
    return neighbors;
  }

  private static reconstructPath(node: PathNode, cellSize: number): Vector2[] {
    const path: Vector2[] = [];
    let curr: PathNode | null = node;

    while (curr) {
      path.unshift(new Vector2((curr.x + 0.5) * cellSize, (curr.y + 0.5) * cellSize));
      curr = curr.parent;
    }
    return path;
  }
}
