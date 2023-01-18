

export type NodeInputs<T = any> = { [identifier: string]: NodeInput<T> };

export class NodeInput<T = any> {
    private latestValue: T;
    constructor(
        public readonly name: string,
        public readonly description: string,
        public handler: (data: T) => void
    ) { }


    handle(data: T) {
        this.latestValue = data;
        this.handler(data);
    }

    getLatestValue() {
        return this.latestValue;
    }
}