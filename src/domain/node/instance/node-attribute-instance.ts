import { NodeAttributeDefinition } from '../definition/node-attribute-definition';
import { DataHolder } from '../data-holder';
import { Identifiable } from '../identifiable';

export class NodeAttributeInstance extends Identifiable {
  definition: NodeAttributeDefinition;
  value: DataHolder;
}
