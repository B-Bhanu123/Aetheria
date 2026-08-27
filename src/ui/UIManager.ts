import { Inventory } from '../gameplay/Items/Inventory';
import { ItemDatabase } from '../gameplay/Items/ItemDatabase';
import { SoundSynth } from '../audio/SoundSynth';
import { AudioManager } from '../audio/AudioManager';

export class UIManager {
  private modalContainer: HTMLElement;
  private inventoryWindow: HTMLElement;
  private skillsWindow: HTMLElement;
  private questsWindow: HTMLElement;
  private editorWindow: HTMLElement;
  private dialogueBox: HTMLElement;

  constructor() {
    this.modalContainer = document.getElementById('modal-container')!;
    this.inventoryWindow = document.getElementById('window-inventory')!;
    this.skillsWindow = document.getElementById('window-skills')!;
    this.questsWindow = document.getElementById('window-quests')!;
    this.editorWindow = document.getElementById('window-editor')!;
    this.dialogueBox = document.getElementById('dialogue-box')!;

    this.bindEvents();
  }

  private bindEvents(): void {
    document.getElementById('btn-inventory')?.addEventListener('click', () => this.toggleWindow(this.inventoryWindow));
    document.getElementById('btn-skills')?.addEventListener('click', () => this.toggleWindow(this.skillsWindow));
    document.getElementById('btn-quest')?.addEventListener('click', () => this.toggleWindow(this.questsWindow));
    document.getElementById('btn-editor')?.addEventListener('click', () => this.toggleWindow(this.editorWindow));

    document.querySelectorAll('.close-btn').forEach(btn => {
      btn.addEventListener('click', () => this.closeAllModals());
    });

    document.getElementById('btn-settings')?.addEventListener('click', () => {
      AudioManager.getInstance().init();
      const muted = AudioManager.getInstance().toggleMute();
      alert(muted ? 'Audio Muted' : 'Audio Unmuted');
    });

    // Keyboard shortcuts
    window.addEventListener('keydown', (e) => {
      if (e.key === 'i' || e.key === 'I') this.toggleWindow(this.inventoryWindow);
      if (e.key === 'k' || e.key === 'K') this.toggleWindow(this.skillsWindow);
      if (e.key === 'q' || e.key === 'Q') this.toggleWindow(this.questsWindow);
      if (e.key === 'e' || e.key === 'E') this.toggleWindow(this.editorWindow);
      if (e.key === 'Escape') this.closeAllModals();

      // Action hotbar 1-5
      if (e.key >= '1' && e.key <= '5') {
        AudioManager.getInstance().init();
        const num = parseInt(e.key);
        if (num === 1) SoundSynth.playSpellCast();
        if (num === 2) SoundSynth.playSwordSwing();
        if (num === 3) SoundSynth.playExplosion();
        if (num === 4) SoundSynth.playSpellCast();
        if (num === 5) SoundSynth.playItemPickup();
      }
    });
  }

  public renderInventoryUI(inventory: Inventory): void {
    const grid = document.getElementById('inventory-grid');
    if (!grid) return;

    grid.innerHTML = '';
    for (let i = 0; i < inventory.capacity; i++) {
      const item = inventory.slots[i];
      const slotDiv = document.createElement('div');
      slotDiv.className = 'item-slot';
      slotDiv.dataset.index = i.toString();

      if (item) {
        slotDiv.innerHTML = `<span>${item.icon}</span>`;
        slotDiv.title = `${item.name} (${item.rarity.toUpperCase()})\n${item.description}`;
      }
      grid.appendChild(slotDiv);
    }
  }

  public toggleWindow(win: HTMLElement): void {
    const isHidden = win.classList.contains('hidden');
    this.closeAllModals();
    if (isHidden) {
      this.modalContainer.classList.remove('hidden');
      win.classList.remove('hidden');
    }
  }

  public closeAllModals(): void {
    this.modalContainer.classList.add('hidden');
    this.inventoryWindow.classList.add('hidden');
    this.skillsWindow.classList.add('hidden');
    this.questsWindow.classList.add('hidden');
    this.editorWindow.classList.add('hidden');
    this.dialogueBox.classList.add('hidden');
  }

  public updateHUD(hp: number, maxHp: number, mp: number, maxMp: number, exp: number, maxExp: number, level: number): void {
    const hpBar = document.getElementById('hp-bar');
    const hpText = document.getElementById('hp-text');
    const mpBar = document.getElementById('mp-bar');
    const mpText = document.getElementById('mp-text');
    const expBar = document.getElementById('exp-bar');
    const expText = document.getElementById('exp-text');
    const lvlText = document.getElementById('player-level');

    if (hpBar) hpBar.style.width = `${(hp / maxHp) * 100}%`;
    if (hpText) hpText.textContent = `${hp} / ${maxHp}`;
    if (mpBar) mpBar.style.width = `${(mp / maxMp) * 100}%`;
    if (mpText) mpText.textContent = `${mp} / ${maxMp}`;
    if (expBar) expBar.style.width = `${(exp / maxExp) * 100}%`;
    if (expText) expText.textContent = `${exp} / ${maxExp}`;
    if (lvlText) lvlText.textContent = level.toString();
  }
}
