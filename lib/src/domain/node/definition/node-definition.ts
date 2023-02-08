import { NodeInputDefinition } from './node-input-definition';
import { NodeOutputDefinition } from './node-output-definition';
import { Identifiable } from '../identifiable';
import { NodeAttributeDefinition } from './node-attribute-definition';
import { NodeInstance } from '../instance/node-instance';
import { NodeState } from '../state/node-state';

export abstract class NodeDefinition extends Identifiable {
  abstract attributes: NodeAttributeDefinition[];

  abstract inputs: NodeInputDefinition[];

  abstract outputs: NodeOutputDefinition[];

  abstract createInstance(
    state: NodeState,
    identifiable: Identifiable,
  ): Promise<NodeInstance>;
}
