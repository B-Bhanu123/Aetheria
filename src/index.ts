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

console.log('⚡ Initializing Aetheria Game Engine...');

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

// Create Hero Entity
const player = world.createEntity('PlayerArchmage');
world.addComponent(player.id, new TransformComponent(600, 600));
world.addComponent(player.id, new VelocityComponent(0, 0, 380, 0.82));
world.addComponent(player.id, new RenderComponent('player', 40, 40, '#38bdf8', 10));
world.addComponent(player.id, new HealthComponent(500, 500));
world.addComponent(player.id, new StatsComponent(15, 20, 12, 10));

let playerMana = 300;
const maxMana = 300;

// Inventory
const playerInventory = new Inventory(24);
playerInventory.addItem(ItemDatabase.createItem('sword_aether')!);
playerInventory.addItem(ItemDatabase.createItem('staff_arcane')!);
playerInventory.addItem(ItemDatabase.createItem('potion_health', 8)!);
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
const playerLight = lightingEngine.addLight(new PointLight(600, 600, 320, '#38bdf8', 0.9));
const auraEmitter = particleSystem.createEmitter(600, 600);
auraEmitter.emitRate = 15;
auraEmitter.color = '#38bdf8';

const playerPos = () => world.getComponent(player.id, TransformComponent)!.position;
renderer.camera.target = playerPos();

// Generate Dungeon Map
const dungeonWidth = 35;
const dungeonHeight = 35;
const tileSize = 64;
let dungeonGrid = BSPDungeonGenerator.generate(dungeonWidth, dungeonHeight, 99);

// Ensure starting area is open floor
for (let rx = 5; rx <= 12; rx++) {
  for (let ry = 5; ry <= 12; ry++) {
    dungeonGrid[rx][ry] = 1;
  }
}

// Spawn Monsters
const spawnMonster = (type: string, x: number, y: number) => {
  const mob = world.createEntity(`Monster_${type}_${Date.now()}`);
  world.addComponent(mob.id, new TransformComponent(x, y));
  world.addComponent(mob.id, new VelocityComponent(0, 0, 140 + Math.random() * 60, 0.85));

  const isLich = type === 'lich';
  const isGoblin = type === 'goblin';

  world.addComponent(mob.id, new RenderComponent(type, isLich ? 44 : 36, isLich ? 44 : 36, isLich ? '#a855f7' : isGoblin ? '#22c55e' : '#ef4444', 5));
  world.addComponent(mob.id, new HealthComponent(isLich ? 300 : isGoblin ? 150 : 100));

  lightingEngine.addLight(new PointLight(x, y, 150, isLich ? '#a855f7' : '#ef4444', 0.6));
};

for (let i = 0; i < 12; i++) {
  const mx = (4 + (i * 3) % 26) * tileSize;
  const my = (4 + (i * 5) % 26) * tileSize;
  spawnMonster(i % 3 === 0 ? 'lich' : i % 2 === 0 ? 'goblin' : 'skeleton', mx, my);
}

// Keyboard Input Handler (Prevent Page Scrolling!)
const keys: Record<string, boolean> = {};

window.addEventListener('keydown', (e) => {
  if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
    e.preventDefault(); // Prevent browser scrolling
  }

  keys[e.key] = true;
  AudioManager.getInstance().init();

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

// On-Screen Virtual D-Pad Controller Handling (Mouse & Touch)
const dpadPress: Record<string, boolean> = { up: false, down: false, left: false, right: false };

const setupDpadBtn = (id: string, dir: string) => {
  const btn = document.getElementById(id);
  if (!btn) return;

  const startMove = (e: Event) => {
    e.preventDefault();
    dpadPress[dir] = true;
    AudioManager.getInstance().init();
  };

  const stopMove = (e: Event) => {
    e.preventDefault();
    dpadPress[dir] = false;
  };

  btn.addEventListener('mousedown', startMove);
  btn.addEventListener('mouseup', stopMove);
  btn.addEventListener('mouseleave', stopMove);
  btn.addEventListener('touchstart', startMove);
  btn.addEventListener('touchend', stopMove);
};

setupDpadBtn('btn-move-up', 'up');
setupDpadBtn('btn-move-down', 'down');
setupDpadBtn('btn-move-left', 'left');
setupDpadBtn('btn-move-right', 'right');

// Interactive Level Editor Canvas Clicking
canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const clickScreen = new Vector2(e.clientX - rect.left, e.clientY - rect.top);
  const worldPos = renderer.camera.screenToWorld(clickScreen);

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
  dungeonGrid = BSPDungeonGenerator.generate(dungeonWidth, dungeonHeight, Math.floor(Math.random() * 1000));
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
    if (pPos.distanceTo(mPos) < 100) {
      const hp = world.getComponent(mob.id, HealthComponent)!;
      const dmg = Math.floor(45 + Math.random() * 35);
      hp.takeDamage(dmg);
      renderer.addFloatingText(`-${dmg}`, mPos.x, mPos.y - 15, '#ef4444');

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
    if (pPos.distanceTo(mPos) < 230) {
      const hp = world.getComponent(mob.id, HealthComponent)!;
      const dmg = Math.floor(85 + Math.random() * 45);
      hp.takeDamage(dmg);
      renderer.addFloatingText(`🔥 -${dmg}`, mPos.x, mPos.y - 20, '#f97316');

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
    if (pPos.distanceTo(mPos) < 190) {
      const hp = world.getComponent(mob.id, HealthComponent)!;
      hp.takeDamage(60);
      renderer.addFloatingText(`❄️ FROZEN -60`, mPos.x, mPos.y - 20, '#38bdf8');

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
    if (pPos.distanceTo(mPos) < 260) {
      const hp = world.getComponent(mob.id, HealthComponent)!;
      hp.takeDamage(100);
      renderer.addFloatingText(`⚡ -100`, mPos.x, mPos.y - 20, '#eab308');

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
  renderer.addFloatingText(`🛡️ +130 Shield`, playerPos().x, playerPos().y - 25, '#38bdf8');
}

function usePotion(): void {
  const hp = world.getComponent(player.id, HealthComponent)!;
  hp.heal(150);
  renderer.addFloatingText(`🧪 +150 HP`, playerPos().x, playerPos().y - 25, '#22c55e');
  SoundSynth.playItemPickup();
}

function killMonster(id: number, pos: Vector2): void {
  world.destroyEntity(id);
  playerGold += 40;
  playerExp += 80;
  questKills++;

  const progressEl = document.getElementById('q-progress');
  if (progressEl) progressEl.textContent = Math.min(5, questKills).toString();

  renderer.addFloatingText('+80 XP +40 Gold', pos.x, pos.y, '#fde047');

  if (playerExp >= playerMaxExp) {
    playerLevel++;
    playerExp = 0;
    playerMaxExp += 250;
    const hp = world.getComponent(player.id, HealthComponent)!;
    hp.current = hp.max += 100;
    renderer.addFloatingText('🎉 LEVEL UP!', playerPos().x, playerPos().y - 40, '#fde047');
    SoundSynth.playSpellCast();
  }
}

// Initial Floating Welcome Banner
setTimeout(() => {
  renderer.addFloatingText('✨ Game Ready! Press WASD / Arrow Keys or Click D-Pad to move!', 600, 550, '#fde047');
}, 500);

// Main Game Loop Update
function update(dt: number): void {
  const vel = world.getComponent(player.id, VelocityComponent);
  const pPos = playerPos();

  // Combine Keyboard & Virtual D-Pad Movement Controls
  if (vel) {
    const move = new Vector2();
    if (keys['w'] || keys['W'] || keys['ArrowUp'] || dpadPress.up) move.y -= 1;
    if (keys['s'] || keys['S'] || keys['ArrowDown'] || dpadPress.down) move.y += 1;
    if (keys['a'] || keys['A'] || keys['ArrowLeft'] || dpadPress.left) move.x -= 1;
    if (keys['d'] || keys['D'] || keys['ArrowRight'] || dpadPress.right) move.x += 1;

    if (move.lengthSq() > 0) {
      move.normalize().multiplyScalar(460);
      vel.velocity.add(move);
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

    if (dist < 420 && dist > 45) {
      const dir = new Vector2().subVectors(pPos, mPos).normalize().multiplyScalar(130);
      mVel.velocity.add(dir);
    } else if (dist <= 45) {
      const playerHp = world.getComponent(player.id, HealthComponent)!;
      playerHp.takeDamage(5 * dt * 8);
      renderer.camera.shake(0.05, 3);
    }
  }

  // Mana Regen
  if (playerMana < maxMana) {
    playerMana = Math.min(maxMana, playerMana + 18 * dt);
  }

  // Update ECS Systems
  world.update(dt);

  // Sync Camera and Particle Systems
  renderer.camera.update(dt);
  playerLight.position.copy(pPos);
  auraEmitter.position.copy(pPos);
  particleSystem.update(dt);

  // Update HUD Bars
  const hp = world.getComponent(player.id, HealthComponent)!;
  uiManager.updateHUD(hp.current, hp.max, playerMana, maxMana, playerExp, playerMaxExp, playerLevel, playerGold);
}

// Main Game Loop Render
function render(dt: number): void {
  renderer.clear('#07090e');
  renderer.renderDungeonTiles(dungeonGrid, tileSize);
  renderer.render(world, dt);
  particleSystem.render(canvas.getContext('2d')!, renderer.camera);
  lightingEngine.render(canvas.getContext('2d')!, renderer.camera);
  renderer.renderMiniMap(document.getElementById('minimap-canvas') as HTMLCanvasElement, world, dungeonGrid);
}

// Start Loop
const gameLoop = new GameLoop(update, render);
gameLoop.start();

console.log('✅ Aetheria Game Engine Running & Virtual Controls Activated!');
