import { Random } from '../math/Random';

export interface Room {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class BSPNode {
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public left: BSPNode | null = null;
  public right: BSPNode | null = null;
  public room: Room | null = null;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  public split(rng: Random, minRoomSize: number): boolean {
    if (this.left || this.right) return false;

    // Determine split direction
    let splitH = rng.nextBool();
    if (this.width / this.height >= 1.25) splitH = false;
    else if (this.height / this.width >= 1.25) splitH = true;

    const max = (splitH ? this.height : this.width) - minRoomSize;
    if (max <= minRoomSize) return false;

    const splitPos = rng.nextInt(minRoomSize, max);

    if (splitH) {
      this.left = new BSPNode(this.x, this.y, this.width, splitPos);
      this.right = new BSPNode(this.x, this.y + splitPos, this.width, this.height - splitPos);
    } else {
      this.left = new BSPNode(this.x, this.y, splitPos, this.height);
      this.right = new BSPNode(this.x + splitPos, this.y, this.width - splitPos, this.height);
    }

    return true;
  }

  public createRooms(rng: Random, minRoomSize: number): void {
    if (this.left || this.right) {
      if (this.left) this.left.createRooms(rng, minRoomSize);
      if (this.right) this.right.createRooms(rng, minRoomSize);
    } else {
      const roomW = rng.nextInt(minRoomSize, this.width - 2);
      const roomH = rng.nextInt(minRoomSize, this.height - 2);
      const roomX = rng.nextInt(1, this.width - roomW - 1);
      const roomY = rng.nextInt(1, this.height - roomH - 1);

      this.room = {
        x: this.x + roomX,
        y: this.y + roomY,
        width: roomW,
        height: roomH
      };
    }
  }

  public getRooms(): Room[] {
    if (this.room) return [this.room];
    let rooms: Room[] = [];
    if (this.left) rooms = rooms.concat(this.left.getRooms());
    if (this.right) rooms = rooms.concat(this.right.getRooms());
    return rooms;
  }
}

export class BSPDungeonGenerator {
  public static generate(width: number, height: number, seed: number = Date.now()): number[][] {
    const rng = new Random(seed);
    const map: number[][] = []; // 0 = wall, 1 = floor, 2 = corridor

    for (let x = 0; x < width; x++) {
      map[x] = new Array(height).fill(0);
    }

    const root = new BSPNode(0, 0, width, height);

    // Recursively split tree
    const nodes: BSPNode[] = [root];
    for (let i = 0; i < 4; i++) {
      const len = nodes.length;
      for (let j = 0; j < len; j++) {
        const node = nodes[j];
        if (node.split(rng, 8)) {
          if (node.left) nodes.push(node.left);
          if (node.right) nodes.push(node.right);
        }
      }
    }

    root.createRooms(rng, 6);
    const rooms = root.getRooms();

    // Carve rooms into map
    for (let i = 0; i < rooms.length; i++) {
      const r = rooms[i];
      for (let rx = r.x; rx < r.x + r.width; rx++) {
        for (let ry = r.y; ry < r.y + r.height; ry++) {
          if (rx >= 0 && rx < width && ry >= 0 && ry < height) {
            map[rx][ry] = 1;
          }
        }
      }
    }

    // Connect rooms with corridors
    for (let i = 0; i < rooms.length - 1; i++) {
      const r1 = rooms[i];
      const r2 = rooms[i + 1];

      const cx1 = Math.floor(r1.x + r1.width / 2);
      const cy1 = Math.floor(r1.y + r1.height / 2);
      const cx2 = Math.floor(r2.x + r2.width / 2);
      const cy2 = Math.floor(r2.y + r2.height / 2);

      // Carve L-shaped corridor
      for (let x = Math.min(cx1, cx2); x <= Math.max(cx1, cx2); x++) {
        if (x >= 0 && x < width && cy1 >= 0 && cy1 < height) map[x][cy1] = 2;
      }
      for (let y = Math.min(cy1, cy2); y <= Math.max(cy1, cy2); y++) {
        if (cx2 >= 0 && cx2 < width && y >= 0 && y < height) map[cx2][y] = 2;
      }
    }

    return map;
  }
}
