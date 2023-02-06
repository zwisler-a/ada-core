import { Injectable } from '@nestjs/common';
import { NetworkStateRepresentation } from '../../persistance/dto/network-state.representation';
import { NetworkState, NetworkStateSnapshot } from '@zwisler/ada-lib';

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

  stateToRepresentation(state: NetworkStateSnapshot) {
    const rep = new NetworkStateRepresentation();
    Object.keys(state).forEach((node) => {
      rep.nodes[node] = { attributes: {} };
      Object.keys(state[node]).forEach((attribute) => {
        rep.nodes[node].attributes[attribute] = state[node][attribute];
      });
    });
    return rep;
  }
}
