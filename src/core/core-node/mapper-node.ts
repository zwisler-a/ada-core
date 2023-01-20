import { NodeInputDefinition } from '../../domain/node/definition/node-input-definition';
import { NodeOutputDefinition } from '../../domain/node/definition/node-output-definition';
import { DataHolder } from '../../domain/node/data-holder';
import { NodeAttributeDefinition } from '../../domain/node/definition/node-attribute-definition';
import { NodeDefinition } from '../../domain/node/definition/node-definition';
import { NodeInstance } from '../../domain/node/instance/node-instance';

export class NodeMapperInstance extends NodeInstance {
  handleInput(input: NodeInputDefinition, data: DataHolder) {
    const attr = this.getAttribute('MapperFunction');
    console.log(attr);
    const functionString = attr.func;
    const func = new Function('object', `return (${functionString})(object)`);
    this.updateOutput(this.outputs[0].definition, func(data));
  }
}

export class MapperNode extends NodeDefinition {
  identifier = 'mapper';
  name = 'Mapper';
  description = 'Maps by the provided function';

  attributes = [
    NodeAttributeDefinition.from(
      'MapperFunction',
      'Mapper Function',
      'Javascript function to map data',
    ),
  ];

  inputs = [NodeInputDefinition.from('in', 'in', 'desc')];

  outputs = [NodeOutputDefinition.from('out', 'out', 'desc')];

  createInstance(): NodeInstance {
    return new NodeMapperInstance(this);
  }
}
