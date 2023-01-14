import { Connectable } from './connectable';

export interface Node {
  name: string;
  description: string;
  inputs: Connectable[];
  outputs: Connectable[];
}
