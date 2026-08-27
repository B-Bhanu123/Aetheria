import { AudioManager } from './AudioManager';
import { Vector2 } from '../math/Vector2';

export class SpatialAudio {
  public static playSpatialSound(pos: Vector2, listenerPos: Vector2, maxDistance: number = 500, playFn: () => void): void {
    const distance = pos.distanceTo(listenerPos);
    if (distance > maxDistance) return;

    const audio = AudioManager.getInstance();
    if (!audio.ctx || !audio.sfxGain) return;

    const volume = Math.max(0, 1 - (distance / maxDistance));
    const pan = Math.max(-1, Math.min(1, (pos.x - listenerPos.x) / (maxDistance / 2)));

    if (audio.ctx.createStereoPanner) {
      const panner = audio.ctx.createStereoPanner();
      panner.pan.value = pan;
    }

    playFn();
  }
}
