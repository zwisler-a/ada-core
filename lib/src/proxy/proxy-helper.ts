import {
  INPUT_DATA_HOLDER,
  NodeInputProxyDefinition,
} from './decorator/node-input.decorator';
import {
  NodeOutputProxyDefinition,
  OUTPUT_DATA_HOLDER,
} from './decorator/node-output.decorator';
import {
  ATTRIBUTE_DATA_HOLDER,
  NodeAttributeProxyDefinition,
} from './decorator/node-attribute.decorator';
import { NodeDefinition } from '../domain/node/definition/node-definition';
import {
  NODE_DATA_HOLDER,
  NodeProxyDefinition,
} from './decorator/node.decorator';
import { ProxyNodeDefinition } from './proxy-node-definition';
import {
  DECONSTRUCT_DATA_HOLDER,
  NodeDeconstructProxyDefinition,
} from './decorator/node-deconstruct.decorator';
import { INITIALIZE_DATA_HOLDER } from './decorator/node-initialize.decorator';

export class ProxyHelper {
  static create(nodeClass: any, ...dependencies: any[]): ProxyNodeDefinition {
    const nodeOptions: NodeProxyDefinition =
      nodeClass.prototype[NODE_DATA_HOLDER];
    const inputOptions: NodeInputProxyDefinition[] =
      nodeClass.prototype[INPUT_DATA_HOLDER];
    const outputOptions: NodeOutputProxyDefinition[] =
      nodeClass.prototype[OUTPUT_DATA_HOLDER];
    const attributeOptions: NodeAttributeProxyDefinition[] =
      nodeClass.prototype[ATTRIBUTE_DATA_HOLDER];
    const deconstructOptions: NodeDeconstructProxyDefinition =
      nodeClass.prototype[DECONSTRUCT_DATA_HOLDER];
    const initializeOptions: NodeDeconstructProxyDefinition =
      nodeClass.prototype[INITIALIZE_DATA_HOLDER];
    if (nodeOptions) {
      return new ProxyNodeDefinition(
        inputOptions,
        outputOptions,
        attributeOptions,
        deconstructOptions,
        initializeOptions,
        nodeOptions,
        (def: NodeDefinition) => new nodeClass(def, ...dependencies),
      );
    }
  }
}
