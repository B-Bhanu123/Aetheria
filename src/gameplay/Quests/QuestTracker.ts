export type QuestStatus = 'not_started' | 'active' | 'completed';

export interface QuestObjective {
  id: string;
  description: string;
  targetCount: number;
  currentCount: number;
  completed: boolean;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  status: QuestStatus;
  objectives: QuestObjective[];
  rewards: {
    exp: number;
    gold: number;
    itemId?: string;
  };
}

export class QuestTracker {
  public quests: Map<string, Quest> = new Map();

  public addQuest(quest: Quest): void {
    this.quests.set(quest.id, quest);
  }

  public acceptQuest(questId: string): void {
    const q = this.quests.get(questId);
    if (q) q.status = 'active';
  }

  public updateObjective(questId: string, objectiveId: string, countDelta: number = 1): void {
    const q = this.quests.get(questId);
    if (!q || q.status !== 'active') return;

    const obj = q.objectives.find(o => o.id === objectiveId);
    if (obj) {
      obj.currentCount = Math.min(obj.targetCount, obj.currentCount + countDelta);
      if (obj.currentCount >= obj.targetCount) {
        obj.completed = true;
      }
    }

    // Check overall quest completion
    if (q.objectives.every(o => o.completed)) {
      q.status = 'completed';
    }
  }

  public getActiveQuests(): Quest[] {
    return Array.from(this.quests.values()).filter(q => q.status === 'active');
  }
}
