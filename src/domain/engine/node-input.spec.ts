import { NodeInput } from "./node-input";

describe('node-input', () => {
    const handlerSpy = jest.fn();
    const nodeInput = new NodeInput<string>('test', 'test', handlerSpy)
    it('remember the latest value it recieved', async () => {
        nodeInput.handle('test');
        expect(nodeInput.getLatestValue()).toBe('test')
    });
    it('call the handler with input', async () => {
        nodeInput.handle('test');
        expect(handlerSpy).toHaveBeenCalledWith('test');
    });
});