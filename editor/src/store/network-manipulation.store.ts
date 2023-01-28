import {
  CoreService,
  NetworkDto,
  NodeInputInstanceDto,
  NodeInstanceDto,
  NodeOutputInstanceDto,
} from '../../openapi-typescript-codegen';
import { firstValueFrom, map, Subject, Subscription } from 'rxjs';
import { networkSelector, networksStore } from './network.store';
import { uuidv4 } from '../util/util';
import { availableNodesStore } from './available-nodes.store';

export class NetworkManipulationStore extends Subject<NetworkDto> {
  private network: NetworkDto;

  subscribe(next?: (value: NetworkDto) => void): Subscription {
    if (this.network && next instanceof Function) next(this.network);
    return super.subscribe(next);
  }

  next(value: NetworkDto) {
    super.next(value);
    this.network = value;
  }

  async loadNetwork(networkId) {
    const network = await firstValueFrom(
      networksStore.select(networkSelector(networkId)),
    );
    this.next(network);
  }

  createNetwork(): string {
    const id = uuidv4();
    this.next({
      edges: [],
      nodes: [],
      name: 'New Network',
      description: '',
      identifier: id,
      active: false,
    });
    return id;
  }

  getNumberOfNodes() {
    return this.network.nodes.length;
  }

  setName(name) {
    this.network.name = name;
    this.next(this.network);
    return this;
  }

  setDescription(description) {
    this.network.description = description;
    this.next(this.network);
    return this;
  }

  addNode(nodeDefinitionId: string) {
    console.log('Adding node ' + nodeDefinitionId);
    const nodeDefinition$ = availableNodesStore.select(
      map((nodes) =>
        nodes.find((node) => node.identifier === nodeDefinitionId),
      ),
    );
    nodeDefinition$.subscribe((definition) => {
      this.network.nodes.push({
        ...definition,
        x: 0,
        y: 0,
        definitionId: definition.identifier,
        identifier: uuidv4(),
        attributes: definition.attributes.map((att) => ({
          ...att,
          definitionId: att.identifier,
          value: '',
          identifier: uuidv4(),
        })),
        inputs: definition.inputs.map((input) => ({
          ...input,
          definition: input,
        })),
        outputs: definition.outputs.map((output) => ({
          ...output,
          definition: output,
        })),
      });
      this.next(this.network);
    });
  }

  addEdge(
    output: NodeOutputInstanceDto,
    input: NodeInputInstanceDto,
    outputNode: NodeOutputInstanceDto,
    inputNode: NodeInstanceDto,
  ) {
    this.network.edges.push({
      identifier: uuidv4(),
      description: '',
      name: '',
      inputNodeIdentifier: inputNode.identifier,
      outputNodeIdentifier: outputNode.identifier,
      inputIdentifier: input.identifier,
      outputIdentifier: output.identifier,
    });
    this.next(this.network);
  }

  removeNode(identifier: string) {}

  removeEdge(node, element) {
    this.network.edges = this.network.edges.filter(
      (edge) =>
        !(
          (node.identifier === edge.inputNodeIdentifier ||
            node.identifier === edge.outputNodeIdentifier) &&
          (edge.inputIdentifier === element.identifier ||
            edge.outputIdentifier === element.identifier)
        ),
    );
    this.next(this.network);
  }

  async save() {
    this.next(await CoreService.saveNetwork(this.network));
    return this;
  }

  getNetwork() {
    return this.network;
  }

  updateNodePosition(node: NodeInstanceDto, offsetX: number, offsetY: number) {
    node.x = offsetX;
    node.y = offsetY;
    this.next(this.network);
  }

  deleteNode(del: NodeInstanceDto) {
    this.network.nodes = this.network.nodes.filter(
      (node) => node.identifier !== del.identifier,
    );
    [...del.outputs, ...del.inputs].forEach((e) => this.removeEdge(del, e));
    this.next(this.network);
  }

  updateNode(node: NodeInstanceDto) {
    this.network.nodes = this.network.nodes.map((n) =>
      n.identifier === node.identifier ? node : n,
    );
    this.next(this.network);
  }

  async refresh() {
    await networksStore.refresh();
    return this.loadNetwork(this.getNetwork().identifier).then();
  }
}

export const networkManipulationStore = new NetworkManipulationStore();
