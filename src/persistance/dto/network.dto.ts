import { NodeRepresentation } from './node.dto';
import { EdgeRepresentation } from './edge.dto';

export class NetworkRepresentation {
  id: string;
  active: boolean;
  name: string;
  description: string;

  nodes: NodeRepresentation[];
  edges: EdgeRepresentation[];
}
