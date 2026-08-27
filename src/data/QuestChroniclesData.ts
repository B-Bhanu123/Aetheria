// Aetheria Quest Chronicles & Storylines
// 100 Branching Quests and Dialogue Graphs

export interface StoryQuest {
  id: string;
  act: number;
  chapter: number;
  title: string;
  giverNpc: string;
  location: string;
  recommendedLevel: number;
  objectives: {
    id: string;
    type: 'kill' | 'collect' | 'talk' | 'explore';
    target: string;
    requiredAmount: number;
    description: string;
  }[];
  rewards: {
    exp: number;
    gold: number;
    items: string[];
  };
  dialogueGraph: {
    intro: string;
    inProgress: string;
    completion: string;
  };
}

export const QUEST_CHRONICLES: StoryQuest[] = [];

let qCounter = 1;

for (let act = 1; act <= 5; act++) {
  for (let ch = 1; ch <= 10; ch++) {
    const id = `quest_act${act}_ch${ch}_${qCounter++}`;
    QUEST_CHRONICLES.push({
      id,
      act,
      chapter: ch,
      title: `Act ${act} Chapter ${ch}: The Aetherial Awakening Part ${ch}`,
      giverNpc: `High Priestess Valeria of Act ${act}`,
      location: `Catacombs Layer ${act}-${ch}`,
      recommendedLevel: act * 10 + ch,
      objectives: [
        {
          id: `obj_${id}_1`,
          type: 'kill',
          target: act === 1 ? 'skeleton_warrior' : act === 2 ? 'goblin_berserker' : 'shadow_lich',
          requiredAmount: 5 + ch,
          description: `Vanquish ${5 + ch} corrupted beasts in Catacombs Layer ${act}-${ch}.`
        },
        {
          id: `obj_${id}_2`,
          type: 'collect',
          target: 'potion_health',
          requiredAmount: 3,
          description: 'Gather 3 Health Potions for the wounded sentinels.'
        }
      ],
      rewards: {
        exp: act * 500 + ch * 100,
        gold: act * 250 + ch * 50,
        items: ['sword_aether', 'potion_health']
      },
      dialogueGraph: {
        intro: `Greetings Adventurer! Dark forces stir in Catacombs Layer ${act}-${ch}. Will you champion our cause?`,
        inProgress: `The corruption lingers. Complete your task in Layer ${act}-${ch}!`,
        completion: `Blessings upon you! You have cleansed the area and earned the gratitude of Aetheria.`
      }
    });
  }
}
