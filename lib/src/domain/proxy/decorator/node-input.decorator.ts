import { NodeInputDefinition } from '../../node/definition/node-input-definition';
import { v4 as uuidv4 } from 'uuid';

export interface NodeInputOptions {
  identifier?: string;
  name: string;
  description?: string;
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
        options.identifier ?? propertyKey,
        options.name,
        options.description,
      ),
      propertyKey,
    });
    target.constructor.prototype[INPUT_DATA_HOLDER] = existingDefinitions;
  };
}
