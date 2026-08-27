import { Component, registerComponent } from '../Component';

@registerComponent
export class HealthComponent extends Component {
  public current: number;
  public max: number;
  public shield: number;

  constructor(max: number = 100, current: number = max) {
    super();
    this.max = max;
    this.current = current;
    this.shield = 0;
  }

  public takeDamage(amount: number): number {
    let actualDamage = amount;
    if (this.shield > 0) {
      if (this.shield >= actualDamage) {
        this.shield -= actualDamage;
        return 0;
      } else {
        actualDamage -= this.shield;
        this.shield = 0;
      }
    }

    this.current = Math.max(0, this.current - actualDamage);
    return actualDamage;
  }

  public heal(amount: number): void {
    this.current = Math.min(this.max, this.current + amount);
  }

  public isAlive(): boolean {
    return this.current > 0;
  }
}
