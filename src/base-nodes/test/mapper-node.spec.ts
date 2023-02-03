import { ProxyHelper } from '../../domain';
import { MapperNode } from '../base-node/mapper-node';
import { NodeState } from '../../domain';

describe('Mapper Node', () => {
  it('should map', async () => {
    const mapperDef = ProxyHelper.create(MapperNode);
    const instance = await mapperDef.createInstance(new NodeState());
    const spy = jest.fn();
    instance.onAttributeChange('MapperFunction', '(data)=>data.string');

    instance.outputs[0].subscribe(spy);
    instance.handleInput(mapperDef.inputs[0].identifier, { string: 'hi' });
    expect(spy).toHaveBeenCalledWith('hi');
  });
});
