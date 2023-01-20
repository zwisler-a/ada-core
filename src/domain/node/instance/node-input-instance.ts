import { NodeInputDefinition } from '../definition/node-input-definition';
import { NodeInstance } from './node-instance';
import { Identifiable } from '../identifiable';

export class NodeInputInstance extends Identifiable {
  definition: NodeInputDefinition;
  node: NodeInstance;
}
