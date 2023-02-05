import { NodeOutputDefinition } from '../../node/definition/node-output-definition';
import { v4 as uuidv4 } from 'uuid';

export interface NodeOutputOptions {
  identifier?: string;
  name: string;
  description?: string;
}

export class NodeOutputProxyDefinition {
  definition: NodeOutputDefinition;
  propertyKey: string;
}

export const OUTPUT_DATA_HOLDER = '_proxyOutputDefinition';

export function Output(options: NodeOutputOptions) {
  return function (target: any, propertyKey: string) {
    let existingDefinitions = target.constructor.prototype[OUTPUT_DATA_HOLDER];
    if (!existingDefinitions) {
      existingDefinitions = [];
    }
    existingDefinitions.push({
      definition: NodeOutputDefinition.from(
        options.identifier ?? propertyKey,
        options.name,
        options.description,
      ),
      propertyKey,
    });
    target.constructor.prototype[OUTPUT_DATA_HOLDER] = existingDefinitions;
  };
}
