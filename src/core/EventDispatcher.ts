export type EventHandler<T = any> = (data: T) => void;

export class EventDispatcher {
  private listeners: Map<string, Set<EventHandler>> = new Map();

  public on<T = any>(event: string, handler: EventHandler<T>): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(handler);
  }

  public off<T = any>(event: string, handler: EventHandler<T>): void {
    if (this.listeners.has(event)) {
      this.listeners.get(event)!.delete(handler);
    }
  }

  public emit<T = any>(event: string, data?: T): void {
    if (this.listeners.has(event)) {
      this.listeners.get(event)!.forEach(handler => {
        try {
          handler(data);
        } catch (e) {
          console.error(`Error executing event handler for ${event}:`, e);
        }
      });
    }
  }

  public clear(): void {
    this.listeners.clear();
  }
}
