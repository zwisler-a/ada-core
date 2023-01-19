import { Node } from "src/domain/engine/node";

export interface NodeProvider {
  getAvailableNodes(): Promise<Node[]>;
}
