import { LoggerNode } from '../base-node/logger-node';
import { IntervalNode } from '../base-node/interval-node';

describe('Interval Node', () => {
  it('should log', () => {
    jest.useFakeTimers();
    jest.spyOn(global, 'setInterval');
    const intervalDef = new IntervalNode();
    const instance = intervalDef.createInstance();
    expect(setInterval).toHaveBeenCalledTimes(1);
    expect(setInterval).toHaveBeenCalledWith(expect.any(Function), 5000);
    instance.handleInput(intervalDef.inputs[0], 1000);
    expect(setInterval).toHaveBeenCalledWith(expect.any(Function), 1000);

    const spy = jest.fn();
    instance.outputs[0].subscribe(spy);
    jest.advanceTimersByTime(1500);
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
