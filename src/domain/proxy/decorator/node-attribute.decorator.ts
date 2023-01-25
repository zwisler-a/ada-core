import { NodeAttributeDefinition } from '../../node/definition/node-attribute-definition';

export interface NodeAttributeOptions {
  identifier: string;
  name: string;
  description: string;
}

export class NodeAttributeProxyDefinition {
  definition: NodeAttributeDefinition;
  propertyKey: string;
  descriptor?: PropertyDescriptor;
}

export const ATTRIBUTE_DATA_HOLDER = '_proxyAttributeDefinition';

export function Attribute(options: NodeAttributeOptions) {
  return function (
    target: any,
    propertyKey: string,
    descriptor?: PropertyDescriptor,
  ) {
    let existingDefinitions =
      target.constructor.prototype[ATTRIBUTE_DATA_HOLDER];
    if (!existingDefinitions) {
      existingDefinitions = [];
    }
    existingDefinitions.push({
      definition: NodeAttributeDefinition.from(
        options.identifier,
        options.name,
        options.description,
      ),
      propertyKey,
      descriptor,
    });
    target.constructor.prototype[ATTRIBUTE_DATA_HOLDER] = existingDefinitions;
  };
}
