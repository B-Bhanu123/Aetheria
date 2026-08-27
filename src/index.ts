import { World } from './core/ECS/World';
import { GameLoop } from './core/GameLoop';
import { Canvas2DRenderer } from './graphics/Canvas2DRenderer';
import { TransformComponent } from './core/ECS/Components/TransformComponent';
import { VelocityComponent } from './core/ECS/Components/VelocityComponent';
import { RenderComponent } from './core/ECS/Components/RenderComponent';
import { HealthComponent } from './core/ECS/Components/HealthComponent';
import { StatsComponent } from './core/ECS/Components/StatsComponent';
import { MovementSystem } from './core/ECS/Systems/MovementSystem';
import { PhysicsSystem } from './core/ECS/Systems/PhysicsSystem';
import { ParticleSystem } from './graphics/Particles/ParticleSystem';
import { LightingEngine } from './graphics/Lighting/LightingEngine';
import { PointLight } from './graphics/Lighting/Light';
import { BSPDungeonGenerator } from './procedural/BSPDungeonGenerator';
import { UIManager } from './ui/UIManager';
import { Inventory } from './gameplay/Items/Inventory';
import { ItemDatabase } from './gameplay/Items/ItemDatabase';
import { Vector2 } from './math/Vector2';
import { SoundSynth } from './audio/SoundSynth';
import { AudioManager } from './audio/AudioManager';

console.log('⚡ Initializing Aetheria Direct Click-to-Move Game Engine...');

// Canvas and Window Sizing
const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const renderer = new Canvas2DRenderer(canvas);
const particleSystem = new ParticleSystem(800);
const lightingEngine = new LightingEngine(canvas.width, canvas.height);
const uiManager = new UIManager();

// Setup ECS World
const world = new World();
world.addSystem(new MovementSystem());
world.addSystem(new PhysicsSystem());

// Player State Variables
let playerGold = 250;
let playerExp = 0;
let playerMaxExp = 500;
let playerLevel = 1;
let questKills = 0;

// Hero Target Destination for Direct Click-to-Move
let targetDestination: Vector2 | null = null;

// Hero Spawn Position (Centered at 1200, 1200)
const spawnX = 1200;
const spawnY = 1200;

const player = world.createEntity('PlayerArchmage');
world.addComponent(player.id, new TransformComponent(spawnX, spawnY));
world.addComponent(player.id, new VelocityComponent(0, 0, 480, 0.80));
world.addComponent(player.id, new RenderComponent('player', 44, 44, '#38bdf8', 10));
world.addComponent(player.id, new HealthComponent(500, 500));
world.addComponent(player.id, new StatsComponent(15, 20, 12, 10));

let playerMana = 300;
const maxMana = 300;

// Center Camera directly on Hero Position
const playerPos = () => world.getComponent(player.id, TransformComponent)!.position;
renderer.camera.position.set(spawnX, spawnY);
renderer.camera.target = playerPos();

// Inventory Setup
const playerInventory = new Inventory(24);
playerInventory.addItem(ItemDatabase.createItem('sword_aether')!);
playerInventory.addItem(ItemDatabase.createItem('staff_arcane')!);
playerInventory.addItem(ItemDatabase.createItem('potion_health', 10)!);
playerInventory.addItem(ItemDatabase.createItem('ring_shadow')!);

const renderInventory = () => {
  uiManager.renderInventoryUI(playerInventory, (slotIndex) => {
    const item = playerInventory.slots[slotIndex];
    if (item && item.type === 'potion') {
      const hp = world.getComponent(player.id, HealthComponent);
      if (hp) {
        hp.heal(150);
        renderer.addFloatingText('+150 HP', playerPos().x, playerPos().y - 20, '#22c55e');
        SoundSynth.playItemPickup();
        playerInventory.removeItem(slotIndex, 1);
        renderInventory();
      }
    } else if (item) {
      renderer.addFloatingText(`Equipped ${item.name}`, playerPos().x, playerPos().y - 20, '#fde047');
      SoundSynth.playItemPickup();
    }
  });
};
renderInventory();

// Attach Player Light & Particle Emitters
const playerLight = lightingEngine.addLight(new PointLight(spawnX, spawnY, 400, '#38bdf8', 1.0));
const auraEmitter = particleSystem.createEmitter(spawnX, spawnY);
auraEmitter.emitRate = 18;
auraEmitter.color = '#38bdf8';

// Generate 60x60 Dungeon Grid
const dungeonWidth = 60;
const dungeonHeight = 60;
const tileSize = 64;
let dungeonGrid: number[][] = [];

const generateFullDungeon = (seed: number) => {
  const map = BSPDungeonGenerator.generate(dungeonWidth, dungeonHeight, seed);
  for (let rx = 10; rx <= 30; rx++) {
    for (let ry = 10; ry <= 30; ry++) {
      map[rx][ry] = 1; // Open floor
    }
  }
  return map;
};

dungeonGrid = generateFullDungeon(101);

// Monster Spawner
const spawnMonster = (type: string, x: number, y: number) => {
  const mob = world.createEntity(`Monster_${type}_${Date.now()}`);
  world.addComponent(mob.id, new TransformComponent(x, y));
  world.addComponent(mob.id, new VelocityComponent(0, 0, 150 + Math.random() * 50, 0.85));

  const isLich = type === 'lich';
  const isGoblin = type === 'goblin';

  world.addComponent(mob.id, new RenderComponent(type, isLich ? 46 : 38, isLich ? 46 : 38, isLich ? '#a855f7' : isGoblin ? '#22c55e' : '#ef4444', 5));
  world.addComponent(mob.id, new HealthComponent(isLich ? 300 : isGoblin ? 150 : 100));

  lightingEngine.addLight(new PointLight(x, y, 180, isLich ? '#a855f7' : '#ef4444', 0.7));
};

// Spawn initial monsters surrounding player
const offsets = [
  { x: -300, y: -200 }, { x: 300, y: -180 }, { x: -250, y: 250 }, { x: 280, y: 220 },
  { x: -400, y: 0 }, { x: 400, y: 0 }, { x: 0, y: -350 }, { x: 0, y: 350 }
];

offsets.forEach((off, i) => {
  spawnMonster(i % 3 === 0 ? 'lich' : i % 2 === 0 ? 'goblin' : 'skeleton', spawnX + off.x, spawnY + off.y);
});

// Keyboard Controls (Prevent Page Scroll!)
const keys: Record<string, boolean> = {};

window.addEventListener('keydown', (e) => {
  if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
    e.preventDefault();
  }

  keys[e.key] = true;
  AudioManager.getInstance().init();

  // Clear mouse target destination when keyboard keys are pressed
  targetDestination = null;

  if (e.code === 'Space') castMeleeAttack();
  if (e.key === '1') castFireball();
  if (e.key === '2') castFrostNova();
  if (e.key === '3') castLightning();
  if (e.key === '4') castAetherShield();
  if (e.key === '5') usePotion();
});

window.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

// Clickable On-Screen Action Hotbar Slots
document.getElementById('slot-attack')?.addEventListener('click', castMeleeAttack);
document.getElementById('slot-1')?.addEventListener('click', castFireball);
document.getElementById('slot-2')?.addEventListener('click', castFrostNova);
document.getElementById('slot-3')?.addEventListener('click', castLightning);
document.getElementById('slot-4')?.addEventListener('click', castAetherShield);
document.getElementById('slot-5')?.addEventListener('click', usePotion);

// Canvas Direct Click-to-Move Handler
canvas.addEventListener('click', (e) => {
  AudioManager.getInstance().init();
  const rect = canvas.getBoundingClientRect();
  const clickScreen = new Vector2(e.clientX - rect.left, e.clientY - rect.top);
  const worldPos = renderer.camera.screenToWorld(clickScreen);

  // Check if Level Editor Studio is active
  const editorWindow = document.getElementById('window-editor');
  const isEditorActive = editorWindow && !editorWindow.classList.contains('hidden');

  if (isEditorActive) {
    const gx = Math.floor(worldPos.x / tileSize);
    const gy = Math.floor(worldPos.y / tileSize);
    const tool = uiManager.activeEditorTool;

    if (tool === 'paint') {
      if (gx >= 0 && gx < dungeonWidth && gy >= 0 && gy < dungeonHeight) {
        dungeonGrid[gx][gy] = 0;
        renderer.addFloatingText('Wall Painted', worldPos.x, worldPos.y, '#fde047');
      }
    } else if (tool === 'floor') {
      if (gx >= 0 && gx < dungeonWidth && gy >= 0 && gy < dungeonHeight) {
        dungeonGrid[gx][gy] = 1;
        renderer.addFloatingText('Floor Painted', worldPos.x, worldPos.y, '#38bdf8');
      }
    } else if (tool === 'spawn-mob') {
      spawnMonster('skeleton', worldPos.x, worldPos.y);
      renderer.addFloatingText('Skeleton Spawned!', worldPos.x, worldPos.y, '#ef4444');
    } else if (tool === 'spawn-boss') {
      spawnMonster('lich', worldPos.x, worldPos.y);
      renderer.addFloatingText('Lich Boss Spawned!', worldPos.x, worldPos.y, '#a855f7');
    }
  } else {
    // Normal Gameplay: Direct Click-to-Move!
    targetDestination = worldPos.clone();
    renderer.addFloatingText('📍 Move Here', worldPos.x, worldPos.y, '#38bdf8', 0.9);
  }
});

// Window Resize Listener
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  renderer.resize(window.innerWidth, window.innerHeight);
  lightingEngine.resize(window.innerWidth, window.innerHeight);
});

// UI Upgrades & Quest Buttons
document.querySelectorAll('.btn-upgrade-skill').forEach(btn => {
  btn.addEventListener('click', () => {
    playerGold += 100;
    renderer.addFloatingText('Skill Upgraded! (+Stat Bonus)', playerPos().x, playerPos().y - 30, '#fde047');
    SoundSynth.playItemPickup();
  });
});

document.getElementById('btn-claim-quest')?.addEventListener('click', () => {
  playerGold += 250;
  playerExp += 500;
  renderer.addFloatingText('+500 XP +250 Gold Reward!', playerPos().x, playerPos().y - 30, '#22c55e');
  SoundSynth.playItemPickup();
  alert('🎉 Quest Completed! Claimed 500 XP and 250 Gold!');
});

document.getElementById('btn-gen-new-dungeon')?.addEventListener('click', () => {
  dungeonGrid = generateFullDungeon(Math.floor(Math.random() * 1000));
  renderer.addFloatingText('Dungeon Regenerated!', playerPos().x, playerPos().y - 30, '#38bdf8');
});

// Spells & Combat Functions
function castMeleeAttack(): void {
  SoundSynth.playSwordSwing();
  renderer.camera.shake(0.15, 6);

  const pPos = playerPos();
  const entities = world.query(new Query({ all: [TransformComponent, HealthComponent] }));

  for (let i = 0; i < entities.length; i++) {
    const mob = entities[i];
    if (mob.id === player.id) continue;

    const mPos = world.getComponent(mob.id, TransformComponent)!.position;
    if (pPos.distanceTo(mPos) < 110) {
      const hp = world.getComponent(mob.id, HealthComponent)!;
      const dmg = Math.floor(45 + Math.random() * 35);
      hp.takeDamage(dmg);
      renderer.addFloatingText(`-${dmg}`, mPos.x, mPos.y - 15, '#ef4444', 1.2);

      if (!hp.isAlive()) killMonster(mob.id, mPos);
    }
  }
}

function castFireball(): void {
  if (playerMana < 25) return;
  playerMana -= 25;

  SoundSynth.playExplosion();
  renderer.camera.shake(0.25, 12);

  const pPos = playerPos();
  const entities = world.query(new Query({ all: [TransformComponent, HealthComponent] }));

  for (let i = 0; i < entities.length; i++) {
    const mob = entities[i];
    if (mob.id === player.id) continue;

    const mPos = world.getComponent(mob.id, TransformComponent)!.position;
    if (pPos.distanceTo(mPos) < 250) {
      const hp = world.getComponent(mob.id, HealthComponent)!;
      const dmg = Math.floor(85 + Math.random() * 45);
      hp.takeDamage(dmg);
      renderer.addFloatingText(`🔥 -${dmg}`, mPos.x, mPos.y - 20, '#f97316', 1.4);

      if (!hp.isAlive()) killMonster(mob.id, mPos);
    }
  }
}

function castFrostNova(): void {
  if (playerMana < 30) return;
  playerMana -= 30;

  SoundSynth.playSpellCast();
  const pPos = playerPos();

  const entities = world.query(new Query({ all: [TransformComponent, HealthComponent] }));
  for (let i = 0; i < entities.length; i++) {
    const mob = entities[i];
    if (mob.id === player.id) continue;

    const mPos = world.getComponent(mob.id, TransformComponent)!.position;
    if (pPos.distanceTo(mPos) < 210) {
      const hp = world.getComponent(mob.id, HealthComponent)!;
      hp.takeDamage(60);
      renderer.addFloatingText(`❄️ FROZEN -60`, mPos.x, mPos.y - 20, '#38bdf8', 1.3);

      if (!hp.isAlive()) killMonster(mob.id, mPos);
    }
  }
}

function castLightning(): void {
  if (playerMana < 40) return;
  playerMana -= 40;

  SoundSynth.playSpellCast();
  const pPos = playerPos();

  const entities = world.query(new Query({ all: [TransformComponent, HealthComponent] }));
  for (let i = 0; i < entities.length; i++) {
    const mob = entities[i];
    if (mob.id === player.id) continue;

    const mPos = world.getComponent(mob.id, TransformComponent)!.position;
    if (pPos.distanceTo(mPos) < 280) {
      const hp = world.getComponent(mob.id, HealthComponent)!;
      hp.takeDamage(100);
      renderer.addFloatingText(`⚡ -100`, mPos.x, mPos.y - 20, '#eab308', 1.5);

      if (!hp.isAlive()) killMonster(mob.id, mPos);
    }
  }
}

function castAetherShield(): void {
  if (playerMana < 20) return;
  playerMana -= 20;

  SoundSynth.playSpellCast();
  const hp = world.getComponent(player.id, HealthComponent)!;
  hp.shield += 130;
  renderer.addFloatingText(`🛡️ +130 Shield`, playerPos().x, playerPos().y - 25, '#38bdf8', 1.3);
}

function usePotion(): void {
  const hp = world.getComponent(player.id, HealthComponent)!;
  hp.heal(150);
  renderer.addFloatingText(`🧪 +150 HP`, playerPos().x, playerPos().y - 25, '#22c55e', 1.3);
  SoundSynth.playItemPickup();
}

function killMonster(id: number, pos: Vector2): void {
  world.destroyEntity(id);
  playerGold += 40;
  playerExp += 80;
  questKills++;

  const progressEl = document.getElementById('q-progress');
  if (progressEl) progressEl.textContent = Math.min(5, questKills).toString();

  renderer.addFloatingText('+80 XP +40 Gold', pos.x, pos.y, '#fde047', 1.2);

  // Respawn a new monster surrounding player
  setTimeout(() => {
    const p = playerPos();
    const rx = p.x + (Math.random() - 0.5) * 600;
    const ry = p.y + (Math.random() - 0.5) * 600;
    spawnMonster(Math.random() > 0.5 ? 'goblin' : 'skeleton', rx, ry);
  }, 2000);

  if (playerExp >= playerMaxExp) {
    playerLevel++;
    playerExp = 0;
    playerMaxExp += 250;
    const hp = world.getComponent(player.id, HealthComponent)!;
    hp.current = hp.max += 100;
    renderer.addFloatingText('🎉 LEVEL UP!', playerPos().x, playerPos().y - 40, '#fde047', 2.0);
    SoundSynth.playSpellCast();
  }
}

// Initial Float Banner
setTimeout(() => {
  renderer.addFloatingText('✨ Click anywhere on map OR use WASD to move Hero!', spawnX, spawnY - 60, '#fde047', 1.4);
}, 300);

// Main Game Loop Update
function update(dt: number): void {
  const vel = world.getComponent(player.id, VelocityComponent);
  const pPos = playerPos();

  // Combine Keyboard WASD Movement & Direct Click-to-Move
  if (vel) {
    const move = new Vector2();
    if (keys['w'] || keys['W'] || keys['ArrowUp']) move.y -= 1;
    if (keys['s'] || keys['S'] || keys['ArrowDown']) move.y += 1;
    if (keys['a'] || keys['A'] || keys['ArrowLeft']) move.x -= 1;
    if (keys['d'] || keys['D'] || keys['ArrowRight']) move.x += 1;

    if (move.lengthSq() > 0) {
      targetDestination = null; // Override mouse click destination with keyboard input
      move.normalize().multiplyScalar(480);
      vel.velocity.add(move);
    } else if (targetDestination) {
      const dist = pPos.distanceTo(targetDestination);
      if (dist > 18) {
        const dir = new Vector2().subVectors(targetDestination, pPos).normalize().multiplyScalar(460);
        vel.velocity.add(dir);
      } else {
        targetDestination = null; // Reached target location
      }
    }
  }

  // Enemy AI Movement & Attack
  const mobs = world.query(new Query({ all: [TransformComponent, VelocityComponent, HealthComponent] }));

  for (let i = 0; i < mobs.length; i++) {
    const mob = mobs[i];
    if (mob.id === player.id) continue;

    const mPos = world.getComponent(mob.id, TransformComponent)!.position;
    const mVel = world.getComponent(mob.id, VelocityComponent)!;
    const dist = mPos.distanceTo(pPos);

    if (dist < 450 && dist > 45) {
      const dir = new Vector2().subVectors(pPos, mPos).normalize().multiplyScalar(130);
      mVel.velocity.add(dir);
    } else if (dist <= 45) {
      const playerHp = world.getComponent(player.id, HealthComponent)!;
      playerHp.takeDamage(5 * dt * 8);
      renderer.camera.shake(0.05, 3);
    }
  }

  // Mana & HP Passive Regeneration
  if (playerMana < maxMana) {
    playerMana = Math.min(maxMana, playerMana + 18 * dt);
  }

  const hp = world.getComponent(player.id, HealthComponent)!;
  if (hp.current < hp.max) {
    hp.current = Math.min(hp.max, hp.current + 2 * dt);
  }

  // Update ECS Systems
  world.update(dt);

  // Sync Camera & Particles
  renderer.camera.update(dt);
  playerLight.position.copy(pPos);
  auraEmitter.position.copy(pPos);
  particleSystem.update(dt);

  // Update HUD Bars
  uiManager.updateHUD(hp.current, hp.max, playerMana, maxMana, playerExp, playerMaxExp, playerLevel, playerGold, questKills);
}

// Main Game Loop Render
function render(dt: number): void {
  renderer.clear('#07090e');
  renderer.renderDungeonTiles(dungeonGrid, tileSize);
  renderer.render(world, dt);

  // Render Target Destination Ring if active
  if (targetDestination) {
    const ctx = canvas.getContext('2d')!;
    const screenPos = new Vector2();
    renderer.camera.worldToScreen(targetDestination, screenPos);

    ctx.save();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(screenPos.x, screenPos.y, 14, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  particleSystem.render(canvas.getContext('2d')!, renderer.camera);
  lightingEngine.render(canvas.getContext('2d')!, renderer.camera);
  renderer.renderMiniMap(document.getElementById('minimap-canvas') as HTMLCanvasElement, world, dungeonGrid);
}

// Start Loop
const gameLoop = new GameLoop(update, render);
gameLoop.start();

console.log('✅ Aetheria Direct Click-to-Move Game Engine Active!');
