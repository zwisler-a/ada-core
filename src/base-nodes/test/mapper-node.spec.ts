import { MapperNode } from '../base-node/mapper-node';

describe('Mapper Node', () => {
  it('should map', () => {
    const mapperDef = new MapperNode();
    const instance = mapperDef.createInstance();
    const spy = jest.fn();
    instance.updateAttribute('MapperFunction', '(data)=>data.string');

    instance.outputs[0].subscribe(spy);
    instance.handleInput(mapperDef.inputs[0], { string: 'hi' });
    expect(spy).toHaveBeenCalledWith('hi');
  });
});
