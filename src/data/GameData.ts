export const MONSTER_DATA = [
  { id: 'skeleton_warrior', name: 'Skeleton Warrior', hp: 80, str: 12, agi: 8, exp: 45, icon: '💀', color: '#e2e8f0' },
  { id: 'goblin_berserker', name: 'Goblin Berserker', hp: 120, str: 18, agi: 14, exp: 75, icon: '👺', color: '#48bb78' },
  { id: 'shadow_lich', name: 'Shadow Lich', hp: 350, str: 10, int: 35, exp: 300, icon: '🧙‍♂️', color: '#9f7aea' }
];

export const SKILL_DATA = [
  { id: 'fireball', name: 'Fireball', icon: '🔥', mpCost: 25, damage: 60, element: 'fire', desc: 'Hurls a fiery orb that explodes on hit.' },
  { id: 'frost_nova', name: 'Frost Nova', icon: '❄️', mpCost: 30, damage: 45, element: 'ice', desc: 'Freezes surrounding enemies in ice.' },
  { id: 'chain_lightning', name: 'Chain Lightning', icon: '⚡', mpCost: 40, damage: 80, element: 'lightning', desc: 'Unleashes electric arc hitting multiple targets.' },
  { id: 'aether_shield', name: 'Aether Shield', icon: '🛡️', mpCost: 20, shield: 100, element: 'holy', desc: 'Surrounds the caster in protective light barrier.' },
  { id: 'potion_heal', name: 'Health Potion', icon: '🧪', mpCost: 0, heal: 150, element: 'physical', desc: 'Restores HP.' }
];
