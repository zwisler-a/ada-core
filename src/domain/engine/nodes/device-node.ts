import { Device } from "../../devices/device";
import { LazyNode } from "../lazy-node";
import { Node } from "../node";
import { NodeInput, NodeInputs } from "../node-input";
import { NodeOutput, NodeOutputs } from "../node-output";

export class DeviceNode extends LazyNode {

    private outputs: NodeOutputs;
    private inputs: NodeInputs;

    constructor(private device?: Device) {
        super()
        if (device && device.synced) this.initalizeWith(device);
    }

    initalizeWith(device: Device) {
        this.outputs = this.generateOutputs(device);
        this.inputs = this.generateInputs(device);
        this.initialized();
    }

    private generateOutputs(device: Device) {
        const outputs: NodeOutputs = {}
        if (device.sensorDefinition) {
            const sensorOutputs = device.sensorDefinition.map(definition => {
                const output = new NodeOutput(
                    definition.name, // TODO identifier
                    definition.name,
                    definition.description
                )
                return { definition, output }
            });
            sensorOutputs.forEach(o => outputs[o.definition.name] = o.output)
            device.updateSensor.subscribe(({ definition, data }) => {
                const output = sensorOutputs.find(o => o.definition === definition);
                output.output.emit(data);
            });
        }
        return outputs;
    }

    private generateInputs(device: Device) {
        const inputs: NodeInputs = {}
        if (device.actorDefinition) {
            const actorInputs = device.actorDefinition.map(definition => new NodeInput(
                definition.name,
                definition.description,
                (data: any) => device.execute(definition, data)
            ));
            actorInputs.forEach(o => inputs[o.name] = o)
        }
        return inputs;
    }

    getInitalizedInputs(): NodeInputs {
        return this.inputs;
    }

    getInitalizedOutputs(): NodeOutputs {
        return this.outputs;
    }

    getDevice() {
        return this.device;
    }
}