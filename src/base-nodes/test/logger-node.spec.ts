import { LoggerNode } from '../base-node/logger-node';

describe('Logger Node', () => {
  it('should log', () => {
    const logDef = new LoggerNode();
    logDef.logger = {
      log: jest.fn(),
    } as any;
    const data = { data: true };
    logDef.createInstance().handleInput(logDef.inputs[0], data);
    expect(logDef.logger.log).toHaveBeenCalledTimes(1);
    expect(logDef.logger.log).toHaveBeenCalledWith(
      '[logger][Logger]: {"data":true}',
    );
  });
});
