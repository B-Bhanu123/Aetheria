export type ElementType = 'physical' | 'fire' | 'ice' | 'lightning' | 'dark' | 'holy';

export interface CombatStats {
  attackPower: number;
  magicPower: number;
  defense: number;
  criticalChance: number;
}

export class DamageMatrix {
  private static elementalAffinity: Record<ElementType, Record<ElementType, number>> = {
    physical: { physical: 1.0, fire: 1.0, ice: 1.0, lightning: 1.0, dark: 1.0, holy: 1.0 },
    fire: { physical: 1.0, fire: 0.5, ice: 2.0, lightning: 1.0, dark: 1.0, holy: 1.0 },
    ice: { physical: 1.0, fire: 0.5, ice: 0.5, lightning: 1.5, dark: 1.0, holy: 1.0 },
    lightning: { physical: 1.0, fire: 1.0, ice: 1.5, lightning: 0.5, dark: 1.0, holy: 1.0 },
    dark: { physical: 1.0, fire: 1.0, ice: 1.0, lightning: 1.0, dark: 0.5, holy: 2.0 },
    holy: { physical: 1.0, fire: 1.0, ice: 1.0, lightning: 1.0, dark: 2.0, holy: 0.5 }
  };

  public static calculateDamage(attacker: CombatStats, defender: CombatStats, element: ElementType = 'physical'): { damage: number; isCrit: boolean } {
    const isCrit = Math.random() < attacker.criticalChance;
    const basePower = element === 'physical' ? attacker.attackPower : attacker.magicPower;
    const critMultiplier = isCrit ? 1.75 : 1.0;

    // Armor defense mitigation formula: Damage * (100 / (100 + Defense))
    const defenseMitigation = 100 / (100 + defender.defense);
    const elementMultiplier = DamageMatrix.elementalAffinity[element]?.[element] || 1.0;

    const damage = Math.round(basePower * critMultiplier * defenseMitigation * elementMultiplier);

    return {
      damage: Math.max(1, damage),
      isCrit
    };
  }
}
