import { Identifiable } from '../../domain';

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

/*

{
  "identifier": "f8939e5e-5ac0-45ab-88b3-897861fe0946",
  "name": "Test Rabbit Connector",
  "description": "This is just for testing",
  "nodes": [{
    "identifier": "b1fc638b-8e70-42c2-8bcb-2adfebb15c1b",
    "name": "Rabbit Test Node",
    "description": "First node displayed from Rabbit :)",
    "attributes": [],
    "inputs": [{
      "identifier": "a4497e27-1b97-45c5-8cd7-550f4d3b2f9c",
      "name": "Send",
      "description": "Lets send something to rabbit"
    }],
    "outputs": []
  }]
}

*/
