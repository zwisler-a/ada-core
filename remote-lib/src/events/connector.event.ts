import { Identifiable } from '../nodes/identifiable';

export interface ConnectorEvent {
  identifier: string;
  name: string;
  description: string;

  nodes: RemoteNodeDefinition[];
}

export class RemoteNodeDefinition extends Identifiable {
  attributes: Identifiable[];
  inputs: Identifiable[];
  outputs: Identifiable[];
}
