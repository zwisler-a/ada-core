import { Connection } from "../../domain/engine/connection";
import { Node } from "../../domain/engine/node";
import { MapperNode } from "../core-nodes/mapper-node";

describe('network', () => {
    describe('create a mapper network', () => {
        const stringToIntMapper = new MapperNode<string, number>(s => Number.parseInt(s));
        const numberToObjectMapper = new MapperNode<number, { n: number }>((n => ({ n })))
        const objectToCalculationsMapper = new MapperNode<{ n: number }, { n: number, n2: number, n3: number }>(
            o => ({ n: o.n, n2: o.n * 2, n3: o.n * 3 })
        )
 
        const createConnection = (inputNode: Node, outNode: Node) => {
            return new Connection(
                null,
                inputNode.getDefaultOutput(),
                outNode.getDefaultInput(),
                inputNode,
                outNode
            )
        }

        const connections = [
            createConnection(stringToIntMapper, numberToObjectMapper),
            createConnection(numberToObjectMapper, objectToCalculationsMapper)
        ]


        it('pass data through the mapper network', async () => {
            const spy = jest.fn();
            objectToCalculationsMapper.getDefaultOutput().subscribe(spy);
            stringToIntMapper.getDefaultInput().handle('100');
            expect(spy).toHaveBeenCalledWith({ n: 100, n2: 200, n3: 300 })
        });
    });

});