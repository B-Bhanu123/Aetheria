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

console.log('⚡ Initializing Aetheria Full Interactive Gameplay Engine...');

// Setup Canvas and Renderer
const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
const renderer = new Canvas2DRenderer(canvas);
const particleSystem = new ParticleSystem(800);
const lightingEngine = new LightingEngine(canvas.width, canvas.height);
const uiManager = new UIManager();

// Setup ECS World
const world = new World();
world.addSystem(new MovementSystem());
world.addSystem(new PhysicsSystem());

// Player State
let playerGold = 250;
let playerExp = 0;
let playerMaxExp = 500;
let playerLevel = 1;
let questKills = 0;

// Create Hero Player Entity
const player = world.createEntity('PlayerArchmage');
world.addComponent(player.id, new TransformComponent(300, 300));
world.addComponent(player.id, new VelocityComponent(0, 0, 350, 0.82));
world.addComponent(player.id, new RenderComponent('player', 40, 40, '#38bdf8', 10));
world.addComponent(player.id, new HealthComponent(500, 500));
world.addComponent(player.id, new StatsComponent(15, 20, 12, 10));

let playerMana = 300;
const maxMana = 300;

// Setup Inventory & Equip
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
const playerLight = lightingEngine.addLight(new PointLight(300, 300, 320, '#38bdf8', 0.9));
const auraEmitter = particleSystem.createEmitter(300, 300);
auraEmitter.emitRate = 15;
auraEmitter.color = '#38bdf8';

// Camera tracking
const playerPos = () => world.getComponent(player.id, TransformComponent)!.position;
renderer.camera.target = playerPos();

// Generate Dungeon Map
const dungeonWidth = 35;
const dungeonHeight = 35;
const tileSize = 64;
let dungeonGrid = BSPDungeonGenerator.generate(dungeonWidth, dungeonHeight, 99);

// Spawn Enemies in Dungeon
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

// Populate initial monsters
for (let i = 0; i < 10; i++) {
  const mx = (3 + (i * 3) % 28) * tileSize;
  const my = (3 + (i * 5) % 28) * tileSize;
  spawnMonster(i % 3 === 0 ? 'lich' : i % 2 === 0 ? 'goblin' : 'skeleton', mx, my);
}

// Keyboard Controls State
const keys: Record<string, boolean> = {};

window.addEventListener('keydown', (e) => {
  keys[e.key] = true;
  AudioManager.getInstance().init();

  // Attack with SPACEBAR
  if (e.code === 'Space') {
    castMeleeAttack();
  }

  // Spell Hotbar 1-5
  if (e.key === '1') castFireball();
  if (e.key === '2') castFrostNova();
  if (e.key === '3') castLightning();
  if (e.key === '4') castAetherShield();
  if (e.key === '5') usePotion();
});

window.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

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
      dungeonGrid[gx][gy] = 0; // Wall
      renderer.addFloatingText('Wall Painted', worldPos.x, worldPos.y, '#fde047');
    }
  } else if (tool === 'floor') {
    if (gx >= 0 && gx < dungeonWidth && gy >= 0 && gy < dungeonHeight) {
      dungeonGrid[gx][gy] = 1; // Floor
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

// Button Handlers for Skill Matrix & Quests
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

// Combat Abilities Implementation
function castMeleeAttack(): void {
  SoundSynth.playSwordSwing();
  renderer.camera.shake(0.15, 6);

  const pPos = playerPos();
  const entities = world.query(new Query({ all: [TransformComponent, HealthComponent] }));

  for (let i = 0; i < entities.length; i++) {
    const mob = entities[i];
    if (mob.id === player.id) continue;

    const mPos = world.getComponent(mob.id, TransformComponent)!.position;
    if (pPos.distanceTo(mPos) < 90) {
      const hp = world.getComponent(mob.id, HealthComponent)!;
      const dmg = Math.floor(40 + Math.random() * 30);
      hp.takeDamage(dmg);
      renderer.addFloatingText(`-${dmg}`, mPos.x, mPos.y - 15, '#ef4444');

      if (!hp.isAlive()) {
        killMonster(mob.id, mPos);
      }
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
    if (pPos.distanceTo(mPos) < 220) {
      const hp = world.getComponent(mob.id, HealthComponent)!;
      const dmg = Math.floor(80 + Math.random() * 40);
      hp.takeDamage(dmg);
      renderer.addFloatingText(`🔥 -${dmg}`, mPos.x, mPos.y - 20, '#f97316');

      if (!hp.isAlive()) {
        killMonster(mob.id, mPos);
      }
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
    if (pPos.distanceTo(mPos) < 180) {
      const hp = world.getComponent(mob.id, HealthComponent)!;
      hp.takeDamage(55);
      renderer.addFloatingText(`❄️ FROZEN -55`, mPos.x, mPos.y - 20, '#38bdf8');

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
    if (pPos.distanceTo(mPos) < 250) {
      const hp = world.getComponent(mob.id, HealthComponent)!;
      hp.takeDamage(95);
      renderer.addFloatingText(`⚡ -95`, mPos.x, mPos.y - 20, '#eab308');

      if (!hp.isAlive()) killMonster(mob.id, mPos);
    }
  }
}

function castAetherShield(): void {
  if (playerMana < 20) return;
  playerMana -= 20;

  SoundSynth.playSpellCast();
  const hp = world.getComponent(player.id, HealthComponent)!;
  hp.shield += 120;
  renderer.addFloatingText(`🛡️ +120 Shield`, playerPos().x, playerPos().y - 25, '#38bdf8');
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

// Main Game Loop Update
function update(dt: number): void {
  const vel = world.getComponent(player.id, VelocityComponent);
  const pPos = playerPos();

  // Player Movement Controls
  if (vel) {
    const move = new Vector2();
    if (keys['w'] || keys['W'] || keys['ArrowUp']) move.y -= 1;
    if (keys['s'] || keys['S'] || keys['ArrowDown']) move.y += 1;
    if (keys['a'] || keys['A'] || keys['ArrowLeft']) move.x -= 1;
    if (keys['d'] || keys['D'] || keys['ArrowRight']) move.x += 1;

    if (move.lengthSq() > 0) {
      move.normalize().multiplyScalar(450);
      vel.velocity.add(move);
    }
  }

  // Enemy AI: Pursue player & attack when close
  const mobs = world.query(new Query({ all: [TransformComponent, VelocityComponent, HealthComponent] }));

  for (let i = 0; i < mobs.length; i++) {
    const mob = mobs[i];
    if (mob.id === player.id) continue;

    const mPos = world.getComponent(mob.id, TransformComponent)!.position;
    const mVel = world.getComponent(mob.id, VelocityComponent)!;
    const dist = mPos.distanceTo(pPos);

    if (dist < 400 && dist > 40) {
      const dir = new Vector2().subVectors(pPos, mPos).normalize().multiplyScalar(120);
      mVel.velocity.add(dir);
    } else if (dist <= 40) {
      // Monster attacks player!
      const playerHp = world.getComponent(player.id, HealthComponent)!;
      playerHp.takeDamage(5 * dt * 10);
      renderer.camera.shake(0.05, 3);
    }
  }

  // Mana Regen
  if (playerMana < maxMana) {
    playerMana = Math.min(maxMana, playerMana + 15 * dt);
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

console.log('✅ Aetheria Game Mechanics Fully Loaded & Interactive!');
