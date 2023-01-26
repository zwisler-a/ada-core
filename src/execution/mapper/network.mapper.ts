import { Injectable, Logger } from '@nestjs/common';
import {
  EdgeRepresentation,
  NetworkRepresentation,
  NodeRepresentation,
} from '../../persistance';
import { Edge, Network, NodeInstance } from '../../domain';
import { AvailableNodeService } from '../service/available-node.service';

@Injectable()
export class NetworkMapper {
  private logger = new Logger(NetworkMapper.name);

  constructor(private availableNodesService: AvailableNodeService) {}

  async createNetwork(rep: NetworkRepresentation) {
    const nodes = await Promise.all(
      rep.nodes.map((nodeRep) => this.createNode(nodeRep)),
    );
    const edges = await Promise.all(
      rep.edges.map((edgeRep) => this.createEdge(edgeRep, nodes)),
    );
    const network = new Network(nodes, edges);
    network.identifier = rep.id;
    network.name = rep.name;
    network.description = rep.description;
    return network;
  }

  async createNode(node: NodeRepresentation) {
    const nodeDefinition = await this.availableNodesService.getByIdentifier(
      node.definitionId,
    );
    const instance = await nodeDefinition.createInstance();
    instance.identifier = node.id;
    instance.name = node.name;
    instance.description = node.description;
    node.attributes.forEach((attribute) =>
      instance.updateAttribute(
        attribute.attributeDefinitionId,
        attribute.value,
      ),
    );
    return instance;
  }

  async createEdge(
    edge: EdgeRepresentation,
    nodes: NodeInstance[],
  ): Promise<Edge> {
    const inputNode = nodes.find(
      (node) => node.identifier === edge.inputNode.id,
    );
    const outputNode = nodes.find(
      (node) => node.identifier === edge.outputNode.id,
    );
    const input = inputNode.inputs.find(
      (i) => i.identifier === edge.inputIdentifier,
    );
    const output = outputNode.outputs.find(
      (o) => o.identifier === edge.outputIdentifier,
    );

    if (!inputNode || !outputNode || input || output) {
      this.logger.error(`Something went wrong with the mapping`);
    }

    const e = new Edge(output, input);
    e.identifier = edge.id;
    e.name = edge.name;
    e.description = edge.description;
    return e;
  }
}
