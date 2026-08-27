import { BTNode, NodeState } from './BTNode';

export class BehaviorTreeEngine {
  public root: BTNode;
  public blackboard: Record<string, any> = {};

  constructor(root: BTNode) {
    this.root = root;
  }

  public tick(): NodeState {
    return this.root.evaluate(this.blackboard);
  }
}
