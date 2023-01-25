import { LoggerNode } from '../base-node/logger-node';
import { ProxyHelper } from '../../domain/proxy/proxy-helper';

describe('Logger Node', () => {
  it('should log', async () => {
    const loggerMock = {
      log: jest.fn(),
    };
    const logDef = ProxyHelper.create(LoggerNode, loggerMock);
    const data = { data: true };
    (await logDef.createInstance()).handleInput(
      logDef.inputs[0].identifier,
      data,
    );
    expect(loggerMock.log).toHaveBeenCalledTimes(1);
    expect(loggerMock.log).toHaveBeenCalledWith(
      '[undefined][Logger]: {"data":true}',
    );
  });
});
