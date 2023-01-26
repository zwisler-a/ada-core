# Connector Integration

## Internal

Connectors provide a set of Node Specifications used by the core to create automations.
They also provide a name and description of the connector module. Connectors are isolated
from the core and run independently (UI / Database / Logic).

Use the `src/core/interface/connector.interface.ts` to specify a connector and
provide it to the cure using the `ConnectorService.register(connector: Connector` method.

```ts 
// src/base-nodes/base-node.provider.ts
import { NodeProvider } from "../execution/interface/node-provider.interface";
import { MapperNode } from "./base-node/mapper-node";
import { NodeDefinition } from "../domain/node/definition/node-definition";
import { LoggerNode } from "./base-node/logger-node";
import { IntervalNode } from "./base-node/interval-node";

export class BaseNodeProvider implements NodeProvider {
  async getAvailableNodes(): Promise<NodeDefinition[]> {
    return [
      new MapperNode(),
      new LoggerNode(),
      new IntervalNode()
    ];
  }
}

```

Registered with

```ts
  constructor(private
connectorService: ConnectorService
)
{
  this.connectorService.register({
    name: 'Base Logic',
    description: 'Provides a set of basic building blocks',
    nodeProvider: new BaseNodeProvider(),
  });
}
```

## External

// TODO

The plan is to create an internal connector allowing remote services to provide their own connectors.
This might be done by adding a connector with REST-Api integration.

Rough outline:

### `GET <remote-connector-url>/connector`

Responds with the connector specification

- Response:

``` json 
{
  "name": "Remote",
  "description": "remote connector",
  "nodeDefinitions": [
    {
      "identifier": "remote-node",
      "name": "Remote node",
      "description": "This is a remote node",
      "inputs": [
        {}
      ],
      "outputs": [
        {}
      ],
      "attributes": [
        {}
      ]
    }
  ]
}
```

### `POST <remote-connector-url>/create-instance`

- Body:

```json 
{
  "definitionIdentifier": "remote-node",
  "attributes": {
    "identifier": "attr1",
    "value": "0"
  }
}
```

- Reponse

```json
{
  "instanceIdentifier": "remote-node1"
}
```

### `POST <remote-connector-url>/trigger-input`

Body

```json
{
  "instanceIdentifier": "remote-node1",
  "value": "123"
}
```

Reposne

```json
{
  "outputs": [
    {
      "identifier": "output1",
      "value": "321"
    }
  ],
  "attributes": [
    {
      "identifier": "attr1",
      "value": "321"
    }
  ]
}
```