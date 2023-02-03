import { Injectable } from '@nestjs/common';
import { NetworkStateRepresentation } from '../dto/network-state.representation';
import { NetworkEntity } from '../entitiy/network.entity';

@Injectable()
export class NetworkStateMapperService {
  entityToState(network: NetworkEntity): NetworkStateRepresentation {
    const state = new NetworkStateRepresentation();
    network.nodes.forEach((node) => {
      const nodeState = state.nodes[node.id] || { attributes: {} };
      node.attributes.forEach((attribute) => {
        nodeState[attribute.id] = attribute.value;
      });
      state.nodes[node.id] = nodeState;
    });
    return state;
  }

  stateToEntity(network: NetworkEntity, state: NetworkStateRepresentation) {
    Object.keys(state.nodes).forEach((nodeId) => {
      const networkNode = network.nodes.find((node) => node.id === nodeId);
      Object.keys(state.nodes[nodeId].attributes).forEach((attributeId) => {
        const attribute = networkNode.attributes.find(
          (attribute) => attribute.id === attributeId,
        );
        attribute.value = networkNode.attributes[attributeId].value;
      });
    });
    return network;
  }
}
