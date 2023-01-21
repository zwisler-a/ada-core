# Smartstuff

[Documentation](./docs/)

### Example Network

```json
{
  "name": "New network",
  "description": "This is a test network",
  "nodes": [
    {
      "identifier": "logger-node",
      "name": "Test Logger",
      "description": "This should log",
      "definitionId": "logger"
    },
    {
      "identifier": "mapper-node",
      "name": "Mapper node",
      "description": "This should map the message",
      "definitionId": "mapper",
      "attributes": [
        {
          "identifier": "MapperFunction",
          "value": "function (obj){return ({message: 'Hallo'})}"
        }
      ]
    },
    {
      "identifier": "interval-node",
      "name": "Test interval",
      "description": "This should emit every 5 seconds",
      "definitionId": "interval"
    }
  ],
  "edges": [
    {
      "identifier": "edge1",
      "name": "To Mapper",
      "description": "Go To Mapper",
      "outputNodeIdentifier": "interval-node",
      "outputIdentifier": "intervalOut",
      "inputNodeIdentifier": "mapper-node",
      "inputIdentifier": "in"
    },
    {
      "identifier": "edge2",
      "name": "To Logger",
      "description": "Go To Logger",
      "outputNodeIdentifier": "mapper-node",
      "outputIdentifier": "out",
      "inputNodeIdentifier": "logger-node",
      "inputIdentifier": "loggerIn"
    }
  ]
}
```