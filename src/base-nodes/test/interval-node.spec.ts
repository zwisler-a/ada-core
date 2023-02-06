import { IntervalNode } from '../base-node/interval-node';
import { NodeState, ProxyHelper } from '@zwisler/ada-lib';

describe('Interval Node', () => {
  it('should interval', async () => {
    jest.useFakeTimers();
    jest.spyOn(global, 'setInterval');
    const intervalDef = ProxyHelper.create(IntervalNode);
    const instance = await intervalDef.createInstance(new NodeState(null));
    instance.onAttributeChange('interval', 5000);
    expect(setInterval).toHaveBeenCalledTimes(1);
    expect(setInterval).toHaveBeenCalledWith(expect.any(Function), 5000);
    instance.handleInput(intervalDef.inputs[0].identifier, 1000);
    expect(setInterval).toHaveBeenCalledWith(expect.any(Function), 1000);

    const spy = jest.fn();
    instance.outputs[0].subscribe(spy);
    jest.advanceTimersByTime(1500);
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
