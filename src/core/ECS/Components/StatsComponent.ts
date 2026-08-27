import { Component, registerComponent } from '../Component';

@registerComponent
export class StatsComponent extends Component {
  public strength: number;
  public intelligence: number;
  public agility: number;
  public defense: number;
  public criticalChance: number;
  public attackPower: number;
  public magicPower: number;

  constructor(str: number = 10, int: number = 10, agi: number = 10, def: number = 5) {
    super();
    this.strength = str;
    this.intelligence = int;
    this.agility = agi;
    this.defense = def;
    this.criticalChance = 0.05 + agi * 0.002;
    this.attackPower = str * 2;
    this.magicPower = int * 2.5;
  }
}
