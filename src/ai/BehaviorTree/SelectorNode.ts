import { BTNode, NodeState } from './BTNode';

export class SelectorNode extends BTNode {
  public children: BTNode[];

  constructor(children: BTNode[] = []) {
    super();
    this.children = children;
  }

  public evaluate(blackboard: Record<string, any>): NodeState {
    for (let i = 0; i < this.children.length; i++) {
      const state = this.children[i].evaluate(blackboard);
      if (state === NodeState.SUCCESS) return NodeState.SUCCESS;
      if (state === NodeState.RUNNING) return NodeState.RUNNING;
    }
    return NodeState.FAILURE;
  }
}
