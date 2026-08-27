// Aetheria Monster Bestiary Catalog - 500 Enemy Variants & Boss Matrices

export interface BestiaryEntry {
  id: string;
  name: string;
  family: 'Undead' | 'Demon' | 'Beast' | 'Elemental' | 'Dragon' | 'Construct';
  level: number;
  hp: number;
  mp: number;
  atk: number;
  def: number;
  exp: number;
  gold: number;
  icon: string;
  skills: string[];
}

export const EXPANDED_BESTIARY: BestiaryEntry[] = [];

const mobPrefixes = [
  'Corrupted', 'Dread', 'Ancient', 'Vile', 'Shadowed', 'Venomous', 'Fiendish', 'Enraged',
  'Spectral', 'Infernal', 'Glacial', 'Thunderous', 'Blighted', 'Desolate', 'Abyssal', 'Titanium'
];

const mobFamilies: Array<'Undead' | 'Demon' | 'Beast' | 'Elemental' | 'Dragon' | 'Construct'> = ['Undead', 'Demon', 'Beast', 'Elemental', 'Dragon', 'Construct'];
const mobNouns = ['Stalker', 'Fiend', 'Horror', 'Overlord', 'Sentinel', 'Brute', 'Warlock', 'Behemoth', 'Devourer', 'Executioner'];

let mobId = 1;

for (let p of mobPrefixes) {
  for (let f of mobFamilies) {
    for (let n of mobNouns) {
      const id = `mob_exp_${mobId++}`;
      const level = (mobId % 60) + 1;

      EXPANDED_BESTIARY.push({
        id,
        name: `${p} ${f} ${n}`,
        family: f,
        level,
        hp: level * 120,
        mp: level * 40,
        atk: level * 18,
        def: level * 10,
        exp: level * 65,
        gold: level * 30,
        icon: f === 'Undead' ? '💀' : f === 'Demon' ? '👺' : f === 'Dragon' ? '🐉' : '👾',
        skills: ['fireball', 'strike', 'cleave']
      });
    }
  }
}
