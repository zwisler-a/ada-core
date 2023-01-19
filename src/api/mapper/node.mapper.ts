import { Node } from "src/domain/engine/node";
import { NodeInput } from "src/domain/engine/node-input";
import { NodeOutput } from "src/domain/engine/node-output";
import { NodeInputDto } from "../dto/node-input.dto";
import { NodeOutputDto } from "../dto/node-output.dto";
import { NodeDto } from "../dto/node.dto";

export function nodeToDto(node: Node): NodeDto {
    const inputs = node.getInputs();
    const outputs = node.getOutputs();

    return {
        identifier: node.identifier,
        name: node.name,
        description: node.description,
        inputs: Object.keys(inputs).map(id => nodeInputToDto(id, inputs[id])),
        outputs: Object.keys(outputs).map(id => nodeOutputToDto(id, outputs[id])),
    }
}

export function nodeInputToDto(id: string, input: NodeInput): NodeInputDto {
    return {
        identifier: id,
        name: input.name,
        description: input.description
    }
}
export function nodeOutputToDto(id: string, input: NodeOutput): NodeOutputDto {
    return {
        identifier: id,
        name: input.name,
        description: input.description,
    }
}