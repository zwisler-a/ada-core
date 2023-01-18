import { Node } from "../../domain/engine/node";
import { NodeInput, NodeInputs } from "../../domain/engine/node-input";
import { NodeOutput, NodeOutputs } from "../../domain/engine/node-output";


export class MapperNode<T, G> extends Node{

    constructor(
        public readonly mapperMethod: (data: T) => G
    ) {
        super();
    }

    private output = new NodeOutput('out', 'out', 'out');

    getInputs(): NodeInputs {
        const input = new NodeInput('default', 'default input', this.defaultInputHandler())
        return {
            [input.name]: input
        }
    }

    getOutputs(): NodeOutputs<T> {
        return { [this.output.identifier]: this.output };
    }

    getDefaultInput(): NodeInput<T> {
        return super.getDefaultInput();
    }

    getDefaultOutput(): NodeOutput<G> {
        return super.getDefaultOutput();
    }


    private defaultInputHandler() {
        return (data: T) => {
            this.output.emit(this.mapperMethod(data))
        }
    }
}