import { BTNode, NodeState } from './BTNode';

export class ActionNode extends BTNode {
  private actionFn: (blackboard: Record<string, any>) => NodeState;

  constructor(actionFn: (blackboard: Record<string, any>) => NodeState) {
    super();
    this.actionFn = actionFn;
  }

  public evaluate(blackboard: Record<string, any>): NodeState {
    return this.actionFn(blackboard);
  }
}
