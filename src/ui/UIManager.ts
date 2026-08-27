import { Inventory } from '../gameplay/Items/Inventory';
import { ItemDatabase } from '../gameplay/Items/ItemDatabase';
import { SoundSynth } from '../audio/SoundSynth';
import { AudioManager } from '../audio/AudioManager';

export class UIManager {
  private modalContainer: HTMLElement;
  private guideWindow: HTMLElement;
  private inventoryWindow: HTMLElement;
  private skillsWindow: HTMLElement;
  private questsWindow: HTMLElement;
  private editorWindow: HTMLElement;

  public activeEditorTool: string = 'paint';
  public equippedItems: Record<string, string> = {};

  constructor() {
    this.modalContainer = document.getElementById('modal-container')!;
    this.guideWindow = document.getElementById('window-guide')!;
    this.inventoryWindow = document.getElementById('window-inventory')!;
    this.skillsWindow = document.getElementById('window-skills')!;
    this.questsWindow = document.getElementById('window-quests')!;
    this.editorWindow = document.getElementById('window-editor')!;

    this.bindEvents();
  }

  private bindEvents(): void {
    const bindBtn = (id: string, win: HTMLElement) => {
      const btn = document.getElementById(id);
      if (!btn) return;
      const handler = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        AudioManager.getInstance().init();
        this.toggleWindow(win);
      };
      btn.addEventListener('pointerdown', handler);
      btn.addEventListener('click', handler);
    };

    bindBtn('btn-guide', this.guideWindow);
    bindBtn('btn-inventory', this.inventoryWindow);
    bindBtn('btn-skills', this.skillsWindow);
    bindBtn('btn-quest', this.questsWindow);
    bindBtn('btn-editor', this.editorWindow);

    document.querySelectorAll('.close-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.closeAllModals();
      });
    });

    // Close modal when clicking dark backdrop area outside window
    this.modalContainer.addEventListener('click', (e) => {
      if (e.target === this.modalContainer) {
        this.closeAllModals();
      }
    });

    document.getElementById('btn-settings')?.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      AudioManager.getInstance().init();
      const muted = AudioManager.getInstance().toggleMute();
      alert(muted ? '🔊 Sound Muted' : '🔊 Sound Enabled');
    });

    // Level Editor Tool Buttons
    document.getElementById('tool-paint')?.addEventListener('click', (e) => this.selectTool(e.target as HTMLElement, 'paint'));
    document.getElementById('tool-floor')?.addEventListener('click', (e) => this.selectTool(e.target as HTMLElement, 'floor'));
    document.getElementById('tool-mob')?.addEventListener('click', (e) => this.selectTool(e.target as HTMLElement, 'spawn-mob'));
    document.getElementById('tool-boss')?.addEventListener('click', (e) => this.selectTool(e.target as HTMLElement, 'spawn-boss'));

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      if (e.key === 'h' || e.key === 'H') this.toggleWindow(this.guideWindow);
      if (e.key === 'i' || e.key === 'I') this.toggleWindow(this.inventoryWindow);
      if (e.key === 'k' || e.key === 'K') this.toggleWindow(this.skillsWindow);
      if (e.key === 'q' || e.key === 'Q') this.toggleWindow(this.questsWindow);
      if (e.key === 'e' || e.key === 'E') this.toggleWindow(this.editorWindow);
      if (e.key === 'Escape') this.closeAllModals();
    });
  }

  private selectTool(btn: HTMLElement, tool: string): void {
    document.querySelectorAll('.editor-toolbar .tool-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    this.activeEditorTool = tool;
  }

  public renderInventoryUI(inventory: Inventory, onUseItem: (slotIndex: number) => void): void {
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
        slotDiv.title = `${item.name} (${item.rarity.toUpperCase()})\nClick to Use / Equip`;
        slotDiv.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          onUseItem(i);
        });
      }
      grid.appendChild(slotDiv);
    }
  }

  public equipItemSlot(slotId: string, itemName: string, icon: string): void {
    const slotEl = document.getElementById(slotId);
    if (!slotEl) return;
    this.equippedItems[slotId] = itemName;
    slotEl.classList.add('equipped');
    slotEl.innerHTML = `${icon} ${itemName}`;
  }

  public toggleWindow(win: HTMLElement): void {
    const isCurrentlyOpen = !win.classList.contains('hidden');
    this.closeAllModals();

    if (!isCurrentlyOpen) {
      this.modalContainer.classList.remove('hidden');
      win.classList.remove('hidden');
    }
  }

  public closeAllModals(): void {
    this.modalContainer.classList.add('hidden');
    this.guideWindow.classList.add('hidden');
    this.inventoryWindow.classList.add('hidden');
    this.skillsWindow.classList.add('hidden');
    this.questsWindow.classList.add('hidden');
    this.editorWindow.classList.add('hidden');
  }

  public updateHUD(hp: number, maxHp: number, mp: number, maxMp: number, exp: number, maxExp: number, level: number, gold: number, kills: number): void {
    const hpBar = document.getElementById('hp-bar');
    const hpText = document.getElementById('hp-text');
    const mpBar = document.getElementById('mp-bar');
    const mpText = document.getElementById('mp-text');
    const expBar = document.getElementById('exp-bar');
    const expText = document.getElementById('exp-text');
    const lvlText = document.getElementById('player-level');
    const goldText = document.getElementById('player-gold');
    const killsText = document.getElementById('player-kills');

    if (hpBar) hpBar.style.width = `${Math.max(0, (hp / maxHp)) * 100}%`;
    if (hpText) hpText.textContent = `${Math.round(hp)} / ${maxHp}`;
    if (mpBar) mpBar.style.width = `${Math.max(0, (mp / maxMp)) * 100}%`;
    if (mpText) mpText.textContent = `${Math.round(mp)} / ${maxMp}`;
    if (expBar) expBar.style.width = `${(exp / maxExp) * 100}%`;
    if (expText) expText.textContent = `${exp} / ${maxExp}`;
    if (lvlText) lvlText.textContent = level.toString();
    if (goldText) goldText.textContent = `💰 ${gold} Gold`;
    if (killsText) killsText.textContent = `💀 ${kills} Kills`;
  }
}
