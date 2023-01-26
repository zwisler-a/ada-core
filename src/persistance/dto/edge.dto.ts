import { NodeRepresentation } from './node.dto';

export class EdgeRepresentation {
  id: string;
  name: string;
  description: string;
  outputIdentifier: string;
  inputIdentifier: string;
  outputNode: NodeRepresentation;
  inputNode: NodeRepresentation;
}
