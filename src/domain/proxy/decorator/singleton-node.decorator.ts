import { v4 as uuidv4 } from 'uuid';

export interface SingletonNodeOptions {
  identifier: string;
  name: string;
  description: string;
}

export const SINGLETON_NODE_DATA_HOLDER = '_proxySingletonNodeDefinition';

export function SingletonNode(options: SingletonNodeOptions) {
  options = Object.assign(
    {
      identifier: uuidv4(),
      name: '',
      description: '',
    },
    options,
  );
  return function (constructor: { prototype: any }) {
    constructor.prototype[SINGLETON_NODE_DATA_HOLDER] = Object.assign(
      {},
      options,
    );
  };
}
