import { Camera } from './Camera';
import { Vector2 } from '../math/Vector2';
import { World } from '../core/ECS/World';
import { Query } from '../core/ECS/Query';
import { TransformComponent } from '../core/ECS/Components/TransformComponent';
import { RenderComponent } from '../core/ECS/Components/RenderComponent';
import { HealthComponent } from '../core/ECS/Components/HealthComponent';

export interface FloatingText {
  id: number;
  text: string;
  x: number;
  y: number;
  color: string;
  life: number;
  maxLife: number;
  scale: number;
}

export class Canvas2DRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  public camera: Camera;
  public floatingTexts: FloatingText[] = [];
  private nextTextId: number = 1;

  private renderQuery: Query = new Query({
    all: [TransformComponent, RenderComponent]
  });

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false })!;
    this.camera = new Camera(canvas.width, canvas.height);
    this.resize(window.innerWidth, window.innerHeight);
  }

  public resize(width: number, height: number): void {
    this.canvas.width = width;
    this.canvas.height = height;
    this.camera.viewportSize.set(width, height);
  }

  public clear(color: string = '#0b0f19'): void {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  public addFloatingText(text: string, x: number, y: number, color: string = '#ef4444', scale: number = 1.0): void {
    this.floatingTexts.push({
      id: this.nextTextId++,
      text,
      x,
      y,
      color,
      life: 1.2,
      maxLife: 1.2,
      scale
    });
  }

  public renderDungeonTiles(mapGrid: number[][], tileSize: number = 64): void {
    const ctx = this.ctx;
    const screenPos = new Vector2();
    const bounds = this.camera.getViewportBounds();

    const startX = Math.max(0, Math.floor(bounds.min.x / tileSize));
    const endX = Math.min(mapGrid.length - 1, Math.ceil(bounds.max.x / tileSize));
    const startY = Math.max(0, Math.floor(bounds.min.y / tileSize));
    const endY = Math.min(mapGrid[0].length - 1, Math.ceil(bounds.max.y / tileSize));

    for (let x = startX; x <= endX; x++) {
      for (let y = startY; y <= endY; y++) {
        const tileType = mapGrid[x][y];
        this.camera.worldToScreen(new Vector2(x * tileSize, y * tileSize), screenPos);

        if (tileType === 0) {
          // Wall Tile: Dark obsidian stone with gold highlights
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(screenPos.x, screenPos.y, tileSize, tileSize);

          // Wall bevel border
          ctx.strokeStyle = '#334155';
          ctx.lineWidth = 2;
          ctx.strokeRect(screenPos.x + 2, screenPos.y + 2, tileSize - 4, tileSize - 4);

          // Brick detail lines
          ctx.strokeStyle = '#0f172a';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(screenPos.x, screenPos.y + tileSize / 2);
          ctx.lineTo(screenPos.x + tileSize, screenPos.y + tileSize / 2);
          ctx.stroke();
        } else {
          // Floor Tile: Deep slate blue with stone texture grid
          const isCheckered = (x + y) % 2 === 0;
          ctx.fillStyle = isCheckered ? '#0f172a' : '#111827';
          ctx.fillRect(screenPos.x, screenPos.y, tileSize, tileSize);

          ctx.strokeStyle = 'rgba(56, 189, 248, 0.05)';
          ctx.lineWidth = 1;
          ctx.strokeRect(screenPos.x, screenPos.y, tileSize, tileSize);
        }
      }
    }
  }

  public render(world: World, dt: number): void {
    const ctx = this.ctx;
    const screenPos = new Vector2();
    const entities = world.query(this.renderQuery);

    // Sort entities by Y position for proper 2.5D depth sorting
    entities.sort((a, b) => {
      const tA = world.getComponent(a.id, TransformComponent)!;
      const tB = world.getComponent(b.id, TransformComponent)!;
      return tA.position.y - tB.position.y;
    });

    for (let i = 0; i < entities.length; i++) {
      const entity = entities[i];
      const transform = world.getComponent(entity.id, TransformComponent)!;
      const render = world.getComponent(entity.id, RenderComponent)!;
      const health = world.getComponent(entity.id, HealthComponent);

      if (!render.visible) continue;

      this.camera.worldToScreen(transform.position, screenPos);

      ctx.save();
      ctx.translate(screenPos.x, screenPos.y);

      const isPlayer = entity.name.includes('Player');

      // Drop Shadow under character
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.beginPath();
      ctx.ellipse(0, render.height / 2 - 4, render.width / 2, render.height / 4, 0, 0, Math.PI * 2);
      ctx.fill();

      // Outer Glowing Ring Aura
      ctx.fillStyle = render.color;
      ctx.shadowColor = render.color;
      ctx.shadowBlur = isPlayer ? 20 : 10;

      ctx.beginPath();
      ctx.arc(0, 0, render.width / 2, 0, Math.PI * 2);
      ctx.fill();

      // Inner Core Circle
      ctx.shadowBlur = 0;
      ctx.fillStyle = isPlayer ? '#ffffff' : '#0f172a';
      ctx.beginPath();
      ctx.arc(0, 0, render.width / 2 - 4, 0, Math.PI * 2);
      ctx.fill();

      // Render Avatar Emoji Icon
      ctx.font = isPlayer ? '24px sans-serif' : '20px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const icon = isPlayer ? '🧙‍♂️' : entity.name.includes('Lich') ? '🧟' : entity.name.includes('Goblin') ? '👺' : '💀';
      ctx.fillText(icon, 0, 0);

      // Render Enemy Name & Health Bar above head
      if (health && !isPlayer) {
        const barWidth = 46;
        const barHeight = 6;
        const hpPercent = Math.max(0, health.current / health.max);

        // Background Bar
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(-barWidth / 2, -render.height / 2 - 16, barWidth, barHeight);

        // Health Fill
        ctx.fillStyle = hpPercent > 0.5 ? '#22c55e' : hpPercent > 0.25 ? '#eab308' : '#ef4444';
        ctx.fillRect(-barWidth / 2, -render.height / 2 - 16, barWidth * hpPercent, barHeight);

        // Border
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.strokeRect(-barWidth / 2, -render.height / 2 - 16, barWidth, barHeight);
      }

      ctx.restore();
    }

    // Render Animated Floating Combat Damage Text
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.life -= dt;
      ft.y -= 40 * dt; // Rise upwards

      if (ft.life <= 0) {
        this.floatingTexts.splice(i, 1);
        continue;
      }

      this.camera.worldToScreen(new Vector2(ft.x, ft.y), screenPos);

      const alpha = Math.min(1.0, ft.life / (ft.maxLife * 0.5));
      const fontSize = Math.round(16 * ft.scale);

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = ft.color;
      ctx.font = `bold ${fontSize}px "Fira Code", monospace`;
      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 6;
      ctx.textAlign = 'center';
      ctx.fillText(ft.text, screenPos.x, screenPos.y);
      ctx.restore();
    }
  }

  public renderMiniMap(canvas: HTMLCanvasElement, world: World, mapGrid: number[][]): void {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#07090e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const scale = canvas.width / mapGrid.length;

    // Render Walls
    ctx.fillStyle = '#334155';
    for (let x = 0; x < mapGrid.length; x++) {
      for (let y = 0; y < mapGrid[0].length; y++) {
        if (mapGrid[x][y] === 0) {
          ctx.fillRect(x * scale, y * scale, scale, scale);
        }
      }
    }

    // Render Entities on MiniMap
    const playerQuery = new Query({ all: [TransformComponent] });
    const entities = world.query(playerQuery);

    for (let i = 0; i < entities.length; i++) {
      const entity = entities[i];
      const transform = world.getComponent(entity.id, TransformComponent)!;
      const gx = (transform.position.x / 64) * scale;
      const gy = (transform.position.y / 64) * scale;

      const isPlayer = entity.name.includes('Player');
      ctx.fillStyle = isPlayer ? '#38bdf8' : '#ef4444';
      ctx.shadowColor = isPlayer ? '#38bdf8' : '#ef4444';
      ctx.shadowBlur = 4;

      ctx.beginPath();
      ctx.arc(gx, gy, isPlayer ? 4 : 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
