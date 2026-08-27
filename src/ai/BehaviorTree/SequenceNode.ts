import { BTNode, NodeState } from './BTNode';

export class SequenceNode extends BTNode {
  public children: BTNode[];

  constructor(children: BTNode[] = []) {
    super();
    this.children = children;
  }

  public evaluate(blackboard: Record<string, any>): NodeState {
    for (let i = 0; i < this.children.length; i++) {
      const state = this.children[i].evaluate(blackboard);
      if (state === NodeState.FAILURE) return NodeState.FAILURE;
      if (state === NodeState.RUNNING) return NodeState.RUNNING;
    }
    return NodeState.SUCCESS;
  }
}
