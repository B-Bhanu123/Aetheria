export class Random {
  private s: number;

  constructor(seed: number = Date.now()) {
    this.s = seed;
  }

  public nextFloat(): number {
    let t = (this.s += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  public nextInt(min: number, max: number): number {
    return Math.floor(this.nextFloat() * (max - min + 1)) + min;
  }

  public nextRange(min: number, max: number): number {
    return this.nextFloat() * (max - min) + min;
  }

  public nextBool(chance: number = 0.5): boolean {
    return this.nextFloat() < chance;
  }

  public choice<T>(array: T[]): T {
    return array[this.nextInt(0, array.length - 1)];
  }
}
