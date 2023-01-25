export interface IOEvent {
  type: 'INPUT' | 'OUTPUT' | 'ATTRIBUTE' | 'CREATE' | 'DESTROY';
  connectorIdentifier: string;
  nodeInstanceIdentifier: string;
}
