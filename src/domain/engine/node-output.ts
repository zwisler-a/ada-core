import { Subject } from "../observable";
export type NodeOutputs<T = any> = { [identifier: string]: NodeOutput<T> };

export class NodeOutput<T = any> extends Subject<T>{
    constructor(
        public readonly identifier: string,
        public readonly name: string,
        public readonly description: string
    ) {
        super();
    }

    emit(data: T) {
        this.next(data);
    }

}