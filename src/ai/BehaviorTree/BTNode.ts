export enum NodeState {
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
  RUNNING = 'RUNNING'
}

export abstract class BTNode {
  public abstract evaluate(blackboard: Record<string, any>): NodeState;
}
