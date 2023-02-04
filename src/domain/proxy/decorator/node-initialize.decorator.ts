export class NodeInitializeProxyDefinition {
  propertyKey: string;
}

export const INITIALIZE_DATA_HOLDER = '_proxyInitializeDefinition';

export function Initialize() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    if (target.constructor.prototype[INITIALIZE_DATA_HOLDER]) {
      throw new Error('Multiple Initialize methods found!');
    }
    target.constructor.prototype[INITIALIZE_DATA_HOLDER] = {
      propertyKey,
    };
  };
}
