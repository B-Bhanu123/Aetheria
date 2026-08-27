import { World } from './core/ECS/World';
import { GameLoop } from './core/GameLoop';
import { Canvas2DRenderer } from './graphics/Canvas2DRenderer';
import { TransformComponent } from './core/ECS/Components/TransformComponent';
import { VelocityComponent } from './core/ECS/Components/VelocityComponent';
import { RenderComponent } from './core/ECS/Components/RenderComponent';
import { HealthComponent } from './core/ECS/Components/HealthComponent';
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

console.log('⚡ Initializing Aetheria: Realms of Fate Engine...');

// Setup Canvas and Renderer
const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
const renderer = new Canvas2DRenderer(canvas);
const particleSystem = new ParticleSystem(500);
const lightingEngine = new LightingEngine(canvas.width, canvas.height);
const uiManager = new UIManager();

// Setup ECS World
const world = new World();
world.addSystem(new MovementSystem());
world.addSystem(new PhysicsSystem());

// Create Player Entity
const player = world.createEntity('PlayerArchmage');
world.addComponent(player.id, new TransformComponent(0, 0));
world.addComponent(player.id, new VelocityComponent(0, 0, 300, 0.85));
world.addComponent(player.id, new RenderComponent('player', 36, 36, '#00d2ff', 10));
world.addComponent(player.id, new HealthComponent(500, 500));

// Setup Player Inventory
const playerInventory = new Inventory(24);
playerInventory.addItem(ItemDatabase.createItem('sword_aether')!);
playerInventory.addItem(ItemDatabase.createItem('staff_arcane')!);
playerInventory.addItem(ItemDatabase.createItem('potion_health', 5)!);
playerInventory.addItem(ItemDatabase.createItem('ring_shadow')!);
uiManager.renderInventoryUI(playerInventory);

// Attach Player Light source
const playerLight = lightingEngine.addLight(new PointLight(0, 0, 280, '#00d2ff', 0.9));

// Camera tracks player
renderer.camera.target = world.getComponent(player.id, TransformComponent)!.position;

// Create Emitter at player
const spellEmitter = particleSystem.createEmitter(0, 0);
spellEmitter.emitRate = 20;

// Generate Dungeon
const dungeonMap = BSPDungeonGenerator.generate(40, 40, 42);

// Handle Keyboard Input for Player Movement
const keys: Record<string, boolean> = {};

window.addEventListener('keydown', (e) => {
  keys[e.key] = true;
  AudioManager.getInstance().init();
});

window.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

// Window Resize Listener
window.addEventListener('resize', () => {
  renderer.resize(window.innerWidth, window.innerHeight);
  lightingEngine.resize(window.innerWidth, window.innerHeight);
});

// Update Loop
function update(dt: number): void {
  const vel = world.getComponent(player.id, VelocityComponent);
  const pos = world.getComponent(player.id, TransformComponent)!.position;

  if (vel) {
    const move = new Vector2();
    if (keys['w'] || keys['W'] || keys['ArrowUp']) move.y -= 1;
    if (keys['s'] || keys['S'] || keys['ArrowDown']) move.y += 1;
    if (keys['a'] || keys['A'] || keys['ArrowLeft']) move.x -= 1;
    if (keys['d'] || keys['D'] || keys['ArrowRight']) move.x += 1;

    if (move.lengthSq() > 0) {
      move.normalize().multiplyScalar(400);
      vel.velocity.add(move);
    }
  }

  // Update ECS Systems
  world.update(dt);

  // Sync Camera and Lights
  renderer.camera.update(dt);
  playerLight.position.copy(pos);
  spellEmitter.position.copy(pos);
  particleSystem.update(dt);

  // Update HUD HP / MP
  const hp = world.getComponent(player.id, HealthComponent);
  if (hp) {
    uiManager.updateHUD(hp.current, hp.max, 300, 300, 450, 1000, 1);
  }
}

// Render Loop
function render(interpolation: number): void {
  renderer.clear('#090a0f');
  renderer.renderGrid(64, 'rgba(255, 255, 255, 0.04)');
  renderer.render(world, interpolation);
  particleSystem.render(renderer.getContext?.() || (canvas.getContext('2d')!), renderer.camera);
  lightingEngine.render(canvas.getContext('2d')!, renderer.camera);
}

// Start Game Loop
const gameLoop = new GameLoop(update, render);
gameLoop.start();

console.log('✅ Aetheria Engine Running Successfully!');
