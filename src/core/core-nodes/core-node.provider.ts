import { Node } from "src/domain/engine/node";
import { NodeProvider } from "../interface/provider/node-provider.interface";
import { MapperNode } from "./mapper-node";

export class CoreNodeProvider implements NodeProvider {
    async getAvailableNodes(): Promise<Node[]> {
        return [
            new MapperNode(a => a)
        ]
    }
}