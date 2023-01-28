import { NodeAttributeDefinition } from '../definition/node-attribute-definition';
import { DataHolder } from '../data-holder';

export class NodeAttributeInstance {
  definition: NodeAttributeDefinition;
  value: DataHolder;
}
