import { NodeInputDefinition } from './node-input-definition';
import { NodeOutputDefinition } from './node-output-definition';
import { Identifiable } from '../identifiable';
import { NodeAttributeDefinition } from './node-attribute-definition';
import { NodeInstance } from '../instance/node-instance';

export abstract class NodeDefinition extends Identifiable {
  abstract attributes: NodeAttributeDefinition[];

  abstract inputs: NodeInputDefinition[];

  abstract outputs: NodeOutputDefinition[];

  abstract createInstance(): Promise<NodeInstance>;
}
