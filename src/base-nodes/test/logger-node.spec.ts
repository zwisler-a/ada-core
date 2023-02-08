import { LoggerNode } from '../base-node/logger-node';
import { Identifiable, NodeState, ProxyHelper } from '@zwisler/ada-lib';

describe('Logger Node', () => {
  it('should log', async () => {
    const loggerMock = {
      log: jest.fn(),
    };
    const logDef = ProxyHelper.create(LoggerNode, loggerMock);
    const data = { data: true };
    (
      await logDef.createInstance(new NodeState(null), Identifiable.create(''))
    ).handleInput(logDef.inputs[0].identifier, data);
    expect(loggerMock.log).toHaveBeenCalledTimes(1);
    expect(loggerMock.log).toHaveBeenCalledWith(
      '[logger][Logger]: {"data":true}',
    );
  });
});
