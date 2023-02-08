import { Injectable, Logger } from '@nestjs/common';
import {
  EdgeRepresentation,
  NetworkRepresentation,
  NodeRepresentation,
} from '../../persistance';
import { AvailableNodeService } from '../service/available-node.service';
import {
  Edge,
  Network,
  NetworkState,
  NodeInstance,
  NodeState,
} from '@zwisler/ada-lib';

@Injectable()
export class NetworkMapper {
  private logger = new Logger(NetworkMapper.name);

  constructor(private availableNodesService: AvailableNodeService) {}

  async createNetwork(rep: NetworkRepresentation, state: NetworkState) {
    const nodes = await Promise.all(
      rep.nodes.map((nodeRep) =>
        this.createNode(nodeRep, state.get(nodeRep.id)),
      ),
    );
    const edges = await Promise.all(
      rep.edges.map((edgeRep) => this.createEdge(edgeRep, nodes)),
    );
    const network = new Network(nodes, edges, state);
    network.identifier = rep.id;
    network.name = rep.name;
    network.description = rep.description;
    return network;
  }

  async createNode(node: NodeRepresentation, nodeState: NodeState) {
    const nodeDefinition = await this.availableNodesService.getByIdentifier(
      node.definitionId,
    );
    if (!nodeDefinition) return null;
    return await nodeDefinition.createInstance(nodeState, {
      identifier: node.id,
      name: node.name,
      description: node.description,
    });
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
      (i) => i.definition.identifier === edge.inputIdentifier,
    );
    const output = outputNode.outputs.find(
      (o) => o.definition.identifier === edge.outputIdentifier,
    );

    if (!inputNode || !outputNode || !input || !output) {
      this.logger.error(`Something went wrong with the mapping`);
      if (!inputNode)
        this.logger.error(`Could not find input node ${edge.inputNode.id}`);
      if (!outputNode)
        this.logger.error(`Could not find output node ${edge.outputNode.id}`);
      if (!input)
        this.logger.error(`Could not find input ${edge.inputIdentifier}`);
      if (!output)
        this.logger.error(`Could not find input node ${edge.outputIdentifier}`);
    }

    const e = new Edge(output, input);
    e.identifier = edge.id;
    e.name = edge.name;
    e.description = edge.description;
    return e;
  }
}
