export interface DialogueOption {
  text: string;
  nextId: string | null;
  action?: string;
}

export interface DialogueNode {
  id: string;
  speaker: string;
  text: string;
  options: DialogueOption[];
}

export class DialogueTree {
  public nodes: Map<string, DialogueNode> = new Map();
  public currentNodeId: string | null = null;

  public addNode(node: DialogueNode): void {
    this.nodes.set(node.id, node);
  }

  public start(rootId: string): DialogueNode | null {
    this.currentNodeId = rootId;
    return this.getCurrentNode();
  }

  public getCurrentNode(): DialogueNode | null {
    return this.currentNodeId ? this.nodes.get(this.currentNodeId) || null : null;
  }

  public selectOption(optionIndex: number): DialogueNode | null {
    const node = this.getCurrentNode();
    if (!node || optionIndex < 0 || optionIndex >= node.options.length) return null;

    const option = node.options[optionIndex];
    this.currentNodeId = option.nextId;
    return this.getCurrentNode();
  }
}
