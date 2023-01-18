import { randomUUID } from "crypto";
import { ValueType } from "../value-types";
import { NodeInputs } from "./node-input";
import { NodeOutputs } from "./node-output";

export abstract class Node {

    public identifier: string = randomUUID();
    public name: string = undefined;
    public description: string = undefined;


    abstract getInputs(): NodeInputs;
    abstract getOutputs(): NodeOutputs;

    getDefaultInput() {
        const inputs = this.getInputs();
        return inputs[Object.keys(inputs)[0]];
    }

    getDefaultOutput() {
        const outputs = this.getOutputs();
        return outputs[Object.keys(outputs)[0]];
    }

    getInputByName(identifier: string) {
        const inputs = this.getInputs();
        return inputs[Object.keys(inputs).find(i => i === identifier)];
    }


    getOutputByName(identifier: string) {
        const output = this.getOutputs();
        return output[Object.keys(output).find(i => i === identifier)];
    }
}