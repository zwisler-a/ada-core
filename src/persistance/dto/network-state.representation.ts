import { DataHolder } from '../../domain';

export class NetworkStateRepresentation {
  nodes: {
    [key: string]: { attributes: { [key: string]: DataHolder } };
  } = {};
}
