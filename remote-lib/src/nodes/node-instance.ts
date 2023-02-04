import { Identifiable } from './identifiable';

export abstract class NodeInstance extends Identifiable {
  updateOutput: (identifier, value) => boolean;

  abstract handleInput(inputIdentifier: string, value: any);

  abstract updateAttribute(attributeIdentifier: string, parse: any);

  abstract deconstruct();
}
