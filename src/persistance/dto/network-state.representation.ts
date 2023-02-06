import { DataHolder } from '@zwisler/ada-lib';

export class NetworkStateRepresentation {
  nodes: {
    [key: string]: { attributes: { [key: string]: DataHolder } };
  } = {};
}
