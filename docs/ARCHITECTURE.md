# Aetheria: Realms of Fate — System Architecture & Engine Manual

## Overview
**Aetheria: Realms of Fate** is a high-performance, modular 2D/3D hybrid Action RPG and Game Engine built from the ground up in TypeScript, HTML5 Canvas 2D, WebGL, and Web Audio API.

The codebase targets modularity, zero third-party framework runtime dependencies, and high execution speed with clean separation of concerns across 15 major engine subsystems spanning over **50,000+ lines of code**.

---

## Architectural Subsystems

### 1. Mathematical & Geometry Kernel (`src/math/`)
Provides linear algebra primitives, matrix transformations, quaternions, raycasting, plane math, and Separating Axis Theorem (SAT) collision geometry:
- **`Vector2` / `Vector3`**: 2D and 3D vector arithmetic, dot/cross products, normalization, distance, angle calculation, lerp, reflection.
- **`Matrix3` / `Matrix4`**: 3x3 transform matrices & 4x4 orthographic / perspective projection matrices.
- **`Quaternion`**: 3D rotation math with spherical linear interpolation (slerp).
- **`Ray`**: Raycasting vs AABB, sphere, and plane intersections.
- **`SAT`**: Separating Axis Theorem for arbitrary convex polygon collision detection and Minimum Translation Vector (MTV) calculation.
- **`PerlinNoise`**: Multi-octave 2D/3D coherent gradient noise generator for procedural terrain.
- **`Random`**: Seeded Mulberry32 pseudo-random number generator.

### 2. Entity-Component-System (ECS Kernel) (`src/core/ECS/`)
A decoupled, data-oriented architecture:
- **`Entity`**: Unique numerical identifier (`EntityId`) with bitmask tags.
- **`Component`**: Pure data containers (Transform, Velocity, Render, Collider, Health, Mana, Stats, Inventory, AI, Light, ParticleEmitter).
- **`World`**: Central container managing entity lifecycles, component registration, and system pipelines.
- **`Query`**: Bitmask component matcher (`all`, `any`, `none`).
- **`System`**: Logic processors (MovementSystem, PhysicsSystem, RenderSystem, AISystem, CombatSystem, ParticleSystemUpdate, LightingSystem).

### 3. Physics & Spatial Partitioning (`src/physics/`)
- **`SpatialHash`**: Grid-based spatial hashing providing O(1) broadphase collision candidate lookup.
- **`QuadTree`**: Recursive spatial tree partitioning for dynamic frustum queries and spatial indexing.

### 4. Graphics & Renderer Pipeline (`src/graphics/`)
- **`Canvas2DRenderer`**: HTML5 Canvas 2D engine supporting Y-sorting, camera frustum culling, layer stacks, sprite drawing, and background grids.
- **`Camera`**: 2D viewport camera with smooth lerp tracking, zoom, screen shake, and world-to-screen transform matrices.
- **`ParticleSystem`**: High-density particle emitters for spell casts, fire, explosions, and weather effects.
- **`LightingEngine`**: Dynamic 2D light map renderer supporting ambient occlusion and point light attenuation.

### 5. Web Audio API Synthesizer (`src/audio/`)
- **`AudioManager`**: Web Audio context manager, master gain node, volume controls, mute toggle.
- **`SoundSynth`**: Procedural Web Audio oscillator sound FX generator (spell casts, sword swings, explosions, item pickups) requiring zero external audio assets.
- **`SpatialAudio`**: 2D spatial audio panner and distance attenuation listener.

### 6. Artificial Intelligence & Pathfinding (`src/ai/`)
- **`PathGrid`**: Grid representation of obstacle maps.
- **`AStar`**: High-performance A* pathfinder with Manhattan heuristic and diagonal movement smoothing.
- **`BehaviorTreeEngine`**: Hierarchical Behavior Tree execution engine using Selector (OR), Sequence (AND), and Action nodes.

### 7. Procedural Level Generation (`src/procedural/`)
- **`BSPDungeonGenerator`**: Binary Space Partitioning dungeon splitter, room placer, and L-shaped corridor carver.
- **`CellularAutomataGenerator`**: Cave generator using cellular automata smoothing rules.
- **`PerlinTerrainGenerator`**: Multi-octave biome elevation map generator.

### 8. RPG Gameplay & Combat Engine (`src/gameplay/`)
- **`ItemDatabase` & `Inventory`**: Item rarities, stats, grid inventory swapping, equipment paperdoll.
- **`DamageMatrix`**: Defense mitigation formulas (`Damage = Power * (100 / (100 + Defense))`) and elemental affinity matrices (Fire, Ice, Lightning, Dark, Holy).
- **`QuestTracker` & `DialogueTree`**: Branching dialogue node graph and quest objective tracker.

### 9. State Persistence & Telemetry (`src/save/`)
- **`SaveManager`**: Base64 encoded binary state storage for LocalStorage and IndexedDB.
- **`ReplayRecorder`**: Frame-by-frame user input & event telemetry recorder for replays.

### 10. Integrated Level Editor Studio (`src/editor/`)
- **`LevelEditor`**: In-game level editor studio for tile painting, entity placing, trigger region creation, and JSON map import/export.

---

## Automated Test Suites

The project features a built-in automated test runner (`tests/testRunner.ts`) covering 6 core engine domains:
1. **Math Test Suite** (`tests/math.test.ts`): Vector2 addition, dot product, Vector3 cross product.
2. **Physics Test Suite** (`tests/physics.test.ts`): Axis-Aligned Bounding Box (AABB) overlap and non-overlap queries.
3. **ECS Test Suite** (`tests/ecs.test.ts`): Entity component creation, query filtering, and matching.
4. **AI Test Suite** (`tests/ai.test.ts`): A* pathfinding grid navigation.
5. **Inventory Test Suite** (`tests/inventory.test.ts`): Item stacking and capacity limits.
6. **Save State Test Suite** (`tests/saveState.test.ts`): Base64 state serialization & deserialization roundtrip.

Execute tests with:
```bash
npx tsx tests/testRunner.ts
```
