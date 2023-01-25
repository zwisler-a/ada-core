import { NodeInputDefinition } from '../../node/definition/node-input-definition';

export interface NodeInputOptions {
  identifier: string;
  name: string;
  description: string;
}

export class NodeInputProxyDefinition {
  definition: NodeInputDefinition;
  propertyKey: string;
}

export const INPUT_DATA_HOLDER = '_proxyInputDefinition';

export function Input(options: NodeInputOptions) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    let existingDefinitions = target.constructor.prototype[INPUT_DATA_HOLDER];
    if (!existingDefinitions) {
      existingDefinitions = [];
    }
    existingDefinitions.push({
      definition: NodeInputDefinition.from(
        options.identifier,
        options.name,
        options.description,
      ),
      propertyKey,
    });
    target.constructor.prototype[INPUT_DATA_HOLDER] = existingDefinitions;
  };
}
