import { ValueType } from '../value-types';

export enum ConnectableType {
  IMPULSE = 'impulse',
  SIGNAL = 'signal',
}

export class Connectable {
  name: string;
  description: string;
  type: ConnectableType;
  dataType: ValueType;
}
