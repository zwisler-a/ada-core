import { Injectable } from '@nestjs/common';
import { NetworkState } from '../../domain';
import { NetworkStateRepresentation } from '../../persistance/dto/network-state.representation';

@Injectable()
export class NetworkStateMapper {
  representationToState(network: NetworkStateRepresentation) {
    const state = new NetworkState();
    Object.keys(network.nodes).forEach((node) => {
      const nodeState = state.get(node);
      Object.keys(network.nodes[node].attributes).forEach((attribute) => {
        const attributeState = nodeState.get(attribute);
        attributeState.set(network.nodes[node].attributes[attribute]);
      });
    });
    return state;
  }
}
