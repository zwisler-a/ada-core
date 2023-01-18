import { Connection } from "./connection";
import { Node } from "./node";

export class Network {
    constructor(
        public identifier: string,
        public name: string,
        public description: string,
        public nodes: Node[],
        public connections: Connection[]
    ) { }
}