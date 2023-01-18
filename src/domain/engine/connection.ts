import { Node } from "./node";
import { NodeInput } from "./node-input";
import { NodeOutput } from "./node-output";

export class Connection {
    subscription: { unsubscribe: () => void; };
    constructor(
        public readonly identifier: string,
        public readonly output: NodeOutput,
        public readonly input: NodeInput,
        public readonly inputNode: Node,
        public readonly outputNode: Node
    ) {
        this.createInputOutputConnection();
    }

    private createInputOutputConnection() {
        this.subscription = this.output.subscribe((data) => this.input.handle(data))
    }

    close() {
        if (this.subscription) this.subscription.unsubscribe();
    }


}