import { Node } from "./node";
import { NodeInput, NodeInputs } from "./node-input";
import { NodeOutput, NodeOutputs } from "./node-output";

export abstract class LazyNode extends Node {
    private readonly defaultIOId = 'default';

    private lateInitalizeInputNodes: NodeInputs = {}
    private lateInitalizeOutputNodes: NodeOutputs = {}

    protected isInitalized = false;

    initialized() {
        this.isInitalized = true;
        const realInputs = this.getInputs();
        const realOutputs = this.getOutputs();
        Object.keys(this.lateInitalizeInputNodes).map(identifier => {
            const realInput = realInputs[identifier];
            const lazyInput = this.lateInitalizeInputNodes[identifier];
            lazyInput.handle = (data) => realInput.handle(data);
        })
        Object.keys(this.lateInitalizeOutputNodes).map(identifier => {
            const realInput = realOutputs[identifier];
            const lazyInput = this.lateInitalizeOutputNodes[identifier];
            lazyInput.getObserver().forEach(obs => realInput.subscribe(obs));
        })
    }



    abstract getInitalizedInputs(): NodeInputs;
    abstract getInitalizedOutputs(): NodeOutputs;

    getInputs(): NodeInputs {
        if (this.isInitalized) {
            return this.getInitalizedInputs();
        } else {
            return {}
        }
    };
    getOutputs(): NodeOutputs {
        if (this.isInitalized) {
            return this.getInitalizedOutputs();
        } else {
            return {}
        }
    };

    getDefaultInput() {
        if (!this.isInitalized) {
            if (!this.lateInitalizeInputNodes[this.defaultIOId])
                this.lateInitalizeInputNodes[this.defaultIOId] = new NodeInput(null, null, null)
            return this.lateInitalizeInputNodes[this.defaultIOId];
        }

        const inputs = this.getInputs();
        return inputs[Object.keys(inputs)[0]];
    }

    getDefaultOutput() {
        if (!this.isInitalized) {
            if (!this.lateInitalizeOutputNodes[this.defaultIOId])
                this.lateInitalizeOutputNodes[this.defaultIOId] = new NodeOutput(null, null, null)
            return this.lateInitalizeOutputNodes[this.defaultIOId];
        }

        const outputs = this.getOutputs();
        return outputs[Object.keys(outputs)[0]];
    }

    getInputByName(identifier: string) {
        if (!this.isInitalized) {
            if (!this.lateInitalizeInputNodes[identifier])
                this.lateInitalizeInputNodes[identifier] = new NodeInput(null, null, null)
            return this.lateInitalizeInputNodes[identifier];
        }

        const inputs = this.getInputs();
        return inputs[Object.keys(inputs).find(i => i === identifier)];
    }


    getOutputByName(identifier: string) {
        if (!this.isInitalized) {
            if (!this.lateInitalizeOutputNodes[identifier])
                this.lateInitalizeOutputNodes[identifier] = new NodeOutput(null, null, null)
            return this.lateInitalizeOutputNodes[identifier];
        }

        const output = this.getOutputs();
        return output[Object.keys(output).find(i => i === identifier)];
    }



}