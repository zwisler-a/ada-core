import { NodeInputDefinition } from '../definition/node-input-definition';
import { NodeInstance } from './node-instance';
import { DataHolder } from '../data-holder';

export class NodeInputInstance {
  definition: NodeInputDefinition;
  node: NodeInstance;

  receive(data: DataHolder) {
    this.node.handleInput(this.definition.identifier, data);
  }
}
