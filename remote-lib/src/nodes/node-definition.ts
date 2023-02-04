import { Identifiable } from './identifiable';

export abstract class NodeDefinition extends Identifiable {
  attributes: Identifiable[];
  inputs: Identifiable[];
  outputs: Identifiable[];

  abstract createInstance(state: object);
}
