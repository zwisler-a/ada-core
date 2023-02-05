export interface IOEvent {
  type: IOEventType;
  connectorIdentifier: string;
  nodeInstanceIdentifier: string;
}

export enum IOEventType {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT',
  ATTRIBUTE = 'ATTRIBUTE',
  CREATE = 'CREATE',
  DESTROY = 'DESTROY',
}
