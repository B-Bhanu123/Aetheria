import { Camera } from './Camera';
import { Vector2 } from '../math/Vector2';
import { World } from '../core/ECS/World';
import { Query } from '../core/ECS/Query';
import { TransformComponent } from '../core/ECS/Components/TransformComponent';
import { RenderComponent } from '../core/ECS/Components/RenderComponent';

export class Canvas2DRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  public camera: Camera;
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

  public clear(color: string = '#090a0f'): void {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  public render(world: World, interpolation: number): void {
    this.clear();
    const screenPos = new Vector2();
    const entities = world.query(this.renderQuery);

    // Sort entities by zIndex & Y-sorting for depth
    entities.sort((a, b) => {
      const rA = world.getComponent(a.id, RenderComponent)!;
      const rB = world.getComponent(b.id, RenderComponent)!;
      if (rA.zIndex !== rB.zIndex) return rA.zIndex - rB.zIndex;
      const tA = world.getComponent(a.id, TransformComponent)!;
      const tB = world.getComponent(b.id, TransformComponent)!;
      return tA.position.y - tB.position.y;
    });

    const ctx = this.ctx;

    for (let i = 0; i < entities.length; i++) {
      const entity = entities[i];
      const transform = world.getComponent(entity.id, TransformComponent)!;
      const render = world.getComponent(entity.id, RenderComponent)!;

      if (!render.visible) continue;

      this.camera.worldToScreen(transform.position, screenPos);

      ctx.save();
      ctx.translate(screenPos.x, screenPos.y);
      ctx.rotate(transform.rotation);
      ctx.scale(transform.scale.x, transform.scale.y);

      // Render placeholder shape or sprite
      ctx.fillStyle = render.color;
      ctx.shadowColor = render.color;
      ctx.shadowBlur = 10;
      ctx.fillRect(-render.width / 2, -render.height / 2, render.width, render.height);

      ctx.restore();
    }
  }

  public renderGrid(gridSize: number = 64, color: string = 'rgba(255, 255, 255, 0.05)'): void {
    const ctx = this.ctx;
    const bounds = this.camera.getViewportBounds();
    const startX = Math.floor(bounds.min.x / gridSize) * gridSize;
    const endX = Math.ceil(bounds.max.x / gridSize) * gridSize;
    const startY = Math.floor(bounds.min.y / gridSize) * gridSize;
    const endY = Math.ceil(bounds.max.y / gridSize) * gridSize;

    const p1 = new Vector2();
    const p2 = new Vector2();

    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.beginPath();

    for (let x = startX; x <= endX; x += gridSize) {
      this.camera.worldToScreen(new Vector2(x, startY), p1);
      this.camera.worldToScreen(new Vector2(x, endY), p2);
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
    }

    for (let y = startY; y <= endY; y += gridSize) {
      this.camera.worldToScreen(new Vector2(startX, y), p1);
      this.camera.worldToScreen(new Vector2(endX, y), p2);
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
    }

    ctx.stroke();
  }
}
