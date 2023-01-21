import { Edge } from '../../../../domain/node/edge';
import { NodeSingletonDefinition } from '../../../../domain/node/definition/node-singleton-definition';
import { NodeAttributeDefinition } from '../../../../domain/node/definition/node-attribute-definition';
import { NodeInputDefinition } from '../../../../domain/node/definition/node-input-definition';
import { NodeOutputDefinition } from '../../../../domain/node/definition/node-output-definition';
import { DataHolder } from '../../../../domain/node/data-holder';
import { EdgeMapperService } from '../../mapper/edge-mapper.service';

class TestNodeDef extends NodeSingletonDefinition {
  spy: any;
  attributes = [NodeAttributeDefinition.from('1', '1', '1')];
  inputs = [NodeInputDefinition.from('1', '1', '1')];
  outputs = [NodeOutputDefinition.from('1', '1', '1')];

  handleInput(input: NodeInputDefinition, data: DataHolder) {
    this.spy(data);
  }
}

describe('Edge Mapper', () => {
  it('should map an edge', function () {
    const mapper = new EdgeMapperService();
    const instance = new TestNodeDef().createInstance();
    instance.identifier = '1';
    const edge = new Edge(instance.outputs[0], instance.inputs[0]);
    edge.identifier = 'id';
    edge.name = 'name';
    edge.description = 'desc';
    const mapped = mapper.entityToEdge(mapper.edgeToEntity(edge), [instance]);
    expect(edge.identifier).toBe('id');
    expect(edge.name).toBe('name');
    expect(edge.description).toBe('desc');
    expect(mapped.output.identifier).toBe(instance.identifier);
    expect(mapped.input.identifier).toBe(instance.identifier);
  });
  it('should map an edge', function () {
    const mapper = new EdgeMapperService();
    const instance = new TestNodeDef().createInstance();
    instance.identifier = '1';
    const instance2 = new TestNodeDef().createInstance();
    const edge = new Edge(instance.outputs[0], instance2.inputs[0]);
    expect(() =>
      mapper.entityToEdge(mapper.edgeToEntity(edge), [instance]),
    ).toThrowError();
  });
});
