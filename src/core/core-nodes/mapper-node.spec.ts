import { MapperNode } from "./mapper-node";

describe('mapper node', () => {
    describe('creates a mapper node', () => {
        const mapperNode = new MapperNode<string, number>(
            (a) => Number.parseInt(a)
        )

        it('mapps the data passed from the input', async () => {
            const spy = jest.fn();
            mapperNode.getDefaultOutput().subscribe(spy)
            mapperNode.getDefaultInput().handle('123')
            expect(spy).toHaveBeenCalledWith(123);
        });
    });
});