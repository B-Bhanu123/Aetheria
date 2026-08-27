export interface InputFrame {
  frame: number;
  dt: number;
  keys: string[];
  mousePos: { x: number; y: number };
}

export class ReplayRecorder {
  private recording: boolean = false;
  private frames: InputFrame[] = [];
  private currentFrame: number = 0;

  public startRecording(): void {
    this.recording = true;
    this.frames = [];
    this.currentFrame = 0;
  }

  public recordFrame(dt: number, keys: string[], mousePos: { x: number; y: number }): void {
    if (!this.recording) return;

    this.frames.push({
      frame: this.currentFrame++,
      dt,
      keys: [...keys],
      mousePos: { ...mousePos }
    });
  }

  public stopRecording(): InputFrame[] {
    this.recording = false;
    return this.frames;
  }

  public getRecordedFrames(): InputFrame[] {
    return this.frames;
  }
}
