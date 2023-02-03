import { AttributeState } from './attribute-state';

export class NodeState {
  private state: { [attributeIdentifier: string]: AttributeState } = {};

  get(attributeIdentifier: string): AttributeState {
    if (!this.state[attributeIdentifier]) {
      this.state[attributeIdentifier] = new AttributeState();
    }
    return this.state[attributeIdentifier];
  }
}
