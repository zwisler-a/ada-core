import { v4 as uuidv4 } from 'uuid';

export interface NodeOptions {
  identifier?: string;
  name: string;
  description?: string;
}

export interface NodeProxyDefinition {
  identifier: string;
  name: string;
  description: string;
}

export const NODE_DATA_HOLDER = '_proxyNodeDefinition';

export function Node(options: NodeOptions) {
  options = Object.assign(
    {
      identifier: uuidv4(),
      name: '',
      description: '',
    },
    options,
  );
  return function (constructor: { prototype: any }) {
    constructor.prototype[NODE_DATA_HOLDER] = Object.assign({}, options);
  };
}
