import {
  SINGLETON_NODE_DATA_HOLDER,
  SingletonNodeOptions,
} from './decorator/singleton-node.decorator';
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
import { NodeDefinition } from '../node/definition/node-definition';
import { NODE_DATA_HOLDER, NodeOptions } from './decorator/node.decorator';
import { SingletonProxyNodeDefinition } from './nodes/singleton-proxy-node-definition';
import { ProxyNodeDefinition } from './nodes/proxy-node-definition';
import { NodeDeconstructProxyDefinition } from './decorator/node-deconstruct.decorator';

export class ProxyHelper {
  static create(nodeClass: any, ...dependencies: any[]): NodeDefinition {
    const nodeOptions: NodeOptions = nodeClass.prototype[NODE_DATA_HOLDER];
    const nodeSingletonOptions: SingletonNodeOptions =
      nodeClass.prototype[SINGLETON_NODE_DATA_HOLDER];
    const inputOptions: NodeInputProxyDefinition[] =
      nodeClass.prototype[INPUT_DATA_HOLDER];
    const outputOptions: NodeOutputProxyDefinition[] =
      nodeClass.prototype[OUTPUT_DATA_HOLDER];
    const attributeOptions: NodeAttributeProxyDefinition[] =
      nodeClass.prototype[ATTRIBUTE_DATA_HOLDER];
    const deconstructOptions: NodeDeconstructProxyDefinition =
      nodeClass.prototype[ATTRIBUTE_DATA_HOLDER];
    if (nodeOptions) {
      return new ProxyNodeDefinition(
        inputOptions,
        outputOptions,
        attributeOptions,
        deconstructOptions,
        nodeOptions,
        (def: NodeDefinition) => new nodeClass(def, ...dependencies),
      );
    }
    if (nodeSingletonOptions && deconstructOptions) {
      throw new Error('Deconstruct is not supported on SingletonNodes!');
    }
    if (nodeSingletonOptions) {
      return new SingletonProxyNodeDefinition(
        inputOptions,
        outputOptions,
        attributeOptions,
        nodeSingletonOptions,
        (def: NodeDefinition) => new nodeClass(def, ...dependencies),
      );
    }
    throw new Error('Could not create Proxy: Missing definitions!');
  }
}
