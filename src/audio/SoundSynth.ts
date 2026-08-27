import { AudioManager } from './AudioManager';

export class SoundSynth {
  public static playSpellCast(): void {
    const audio = AudioManager.getInstance();
    if (!audio.ctx || !audio.sfxGain) return;

    const osc = audio.ctx.createOscillator();
    const gain = audio.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, audio.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, audio.ctx.currentTime + 0.3);

    gain.gain.setValueAtTime(0.3, audio.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audio.ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(audio.sfxGain);

    osc.start();
    osc.stop(audio.ctx.currentTime + 0.3);
  }

  public static playSwordSwing(): void {
    const audio = AudioManager.getInstance();
    if (!audio.ctx || !audio.sfxGain) return;

    const osc = audio.ctx.createOscillator();
    const gain = audio.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(200, audio.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, audio.ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.4, audio.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audio.ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(audio.sfxGain);

    osc.start();
    osc.stop(audio.ctx.currentTime + 0.15);
  }

  public static playExplosion(): void {
    const audio = AudioManager.getInstance();
    if (!audio.ctx || !audio.sfxGain) return;

    const osc = audio.ctx.createOscillator();
    const gain = audio.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, audio.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(20, audio.ctx.currentTime + 0.4);

    gain.gain.setValueAtTime(0.5, audio.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audio.ctx.currentTime + 0.4);

    osc.connect(gain);
    gain.connect(audio.sfxGain);

    osc.start();
    osc.stop(audio.ctx.currentTime + 0.4);
  }

  public static playItemPickup(): void {
    const audio = AudioManager.getInstance();
    if (!audio.ctx || !audio.sfxGain) return;

    const osc = audio.ctx.createOscillator();
    const gain = audio.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, audio.ctx.currentTime); // C5
    osc.frequency.setValueAtTime(659.25, audio.ctx.currentTime + 0.08); // E5
    osc.frequency.setValueAtTime(783.99, audio.ctx.currentTime + 0.16); // G5

    gain.gain.setValueAtTime(0.25, audio.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audio.ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(audio.sfxGain);

    osc.start();
    osc.stop(audio.ctx.currentTime + 0.25);
  }
}
