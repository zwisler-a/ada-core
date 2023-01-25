export interface NodeOptions {
  identifier: string;
  name: string;
  description: string;
}

export const NODE_DATA_HOLDER = '_proxyNodeDefinition';

export function Node(options: NodeOptions) {
  return function (constructor: { prototype: any }) {
    if (constructor.prototype[NODE_DATA_HOLDER])
      throw new Error('Data holder is already defined!');

    constructor.prototype[NODE_DATA_HOLDER] = Object.assign({}, options);
  };
}
