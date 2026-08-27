export class GameLoop {
  private updateFn: (dt: number) => void;
  private renderFn: (interpolation: number) => void;
  private isRunning: boolean = false;
  private lastTime: number = 0;
  private accumulator: number = 0;
  private fixedStep: number = 1 / 60; // 60 updates per second
  private maxAccumulator: number = 0.25; // Prevent spiral of death
  private animFrameId: number = 0;

  constructor(updateFn: (dt: number) => void, renderFn: (interpolation: number) => void) {
    this.updateFn = updateFn;
    this.renderFn = renderFn;
  }

  public start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.accumulator = 0;
    this.loop = this.loop.bind(this);
    this.animFrameId = requestAnimationFrame(this.loop);
  }

  public stop(): void {
    this.isRunning = false;
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
    }
  }

  private loop(currentTime: number): void {
    if (!this.isRunning) return;

    let dt = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    if (dt > this.maxAccumulator) {
      dt = this.maxAccumulator;
    }

    this.accumulator += dt;

    while (this.accumulator >= this.fixedStep) {
      this.updateFn(this.fixedStep);
      this.accumulator -= this.fixedStep;
    }

    const interpolation = this.accumulator / this.fixedStep;
    this.renderFn(interpolation);

    this.animFrameId = requestAnimationFrame(this.loop);
  }
}
