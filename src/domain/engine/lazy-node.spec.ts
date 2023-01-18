import { Connection } from "./connection";
import { LazyNode } from "./lazy-node";
import { NodeInput, NodeInputs } from "./node-input";
import { NodeOutput, NodeOutputs } from "./node-output";

export class TestLazyNode extends LazyNode {

    spy: Function;

    output = new NodeOutput('default', 'initalized', '');
    input = new NodeInput('default', 'initalized', () => { if(this.spy) this.spy(); });

    getInitalizedInputs(): NodeInputs<any> {
        return { default: this.input }
    }
    getInitalizedOutputs(): NodeOutputs<any> {
        return { default: this.output }
    }

}

describe('node-input', () => {
    it("should lazily initalzied output", () => {
        const node = new TestLazyNode();
        const spy = jest.fn();
        node.spy = spy;
        new Connection('', node.getDefaultOutput(), node.getDefaultInput(), null, null);
        node.initialized();
        node.getDefaultOutput().next('test')

        expect(spy).toHaveBeenCalledTimes(1);
    });

});