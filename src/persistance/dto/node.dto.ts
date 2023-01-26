import { NodeAttributeRepresentation } from './node-attribute.dto';

export class NodeRepresentation {
  id: string;
  definitionId: string;
  name: string;
  description: string;
  attributes: NodeAttributeRepresentation[];
}
