export class NodeDeconstructProxyDefinition {
  propertyKey: string;
}

export const DECONSTRUCT_DATA_HOLDER = '_proxyDeconstructDefinition';

export function Deconstruct() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    if (target.constructor.prototype[DECONSTRUCT_DATA_HOLDER]) {
      throw new Error('Multiple deconstruct methods found!');
    }
    target.constructor.prototype[DECONSTRUCT_DATA_HOLDER] = {
      propertyKey,
    };
  };
}
