// Aetheria Skills & Spellbook Matrix
// Complete catalog of 150+ Class Skills, Elemental Spells & Buff Matrices

export interface SpellDefinition {
  id: string;
  name: string;
  className: 'Mage' | 'Warrior' | 'Rogue' | 'Paladin' | 'Necromancer' | 'Druid';
  element: 'fire' | 'ice' | 'lightning' | 'dark' | 'holy' | 'physical';
  icon: string;
  mpCost: number;
  cooldown: number; // in seconds
  castTime: number;
  baseDamage: number;
  scalingStat: 'intelligence' | 'strength' | 'agility';
  scalingFactor: number;
  areaOfEffectRadius: number;
  projectileSpeed: number;
  statusEffect?: {
    type: 'burn' | 'freeze' | 'stun' | 'poison' | 'bleed' | 'shield' | 'haste';
    duration: number;
    value: number;
  };
  description: string;
}

export const SPELL_DATABASE: SpellDefinition[] = [];

const spellElements: Array<'fire' | 'ice' | 'lightning' | 'dark' | 'holy' | 'physical'> = ['fire', 'ice', 'lightning', 'dark', 'holy', 'physical'];
const classes: Array<'Mage' | 'Warrior' | 'Rogue' | 'Paladin' | 'Necromancer' | 'Druid'> = ['Mage', 'Warrior', 'Rogue', 'Paladin', 'Necromancer', 'Druid'];

let spellIdCounter = 1;

for (let cls of classes) {
  for (let elem of spellElements) {
    for (let tier = 1; tier <= 5; tier++) {
      const id = `spell_${cls.toLowerCase()}_${elem}_t${tier}_${spellIdCounter++}`;
      SPELL_DATABASE.push({
        id,
        name: `${cls} ${elem.toUpperCase()} Strike Tier ${tier}`,
        className: cls,
        element: elem,
        icon: elem === 'fire' ? '🔥' : elem === 'ice' ? '❄️' : elem === 'lightning' ? '⚡' : elem === 'dark' ? '💀' : elem === 'holy' ? '✨' : '⚔️',
        mpCost: 15 + tier * 10,
        cooldown: 1.0 + tier * 0.5,
        castTime: tier > 3 ? 1.5 : 0.0,
        baseDamage: tier * 45,
        scalingStat: cls === 'Mage' || cls === 'Necromancer' ? 'intelligence' : cls === 'Rogue' ? 'agility' : 'strength',
        scalingFactor: 1.5 + tier * 0.3,
        areaOfEffectRadius: tier * 20,
        projectileSpeed: 400 + tier * 50,
        statusEffect: {
          type: elem === 'fire' ? 'burn' : elem === 'ice' ? 'freeze' : elem === 'lightning' ? 'stun' : elem === 'dark' ? 'poison' : 'shield',
          duration: 3.0 + tier,
          value: tier * 15
        },
        description: `Unleashes a powerful tier ${tier} ${elem} attack scaled with ${cls} stats.`
      });
    }
  }
}
