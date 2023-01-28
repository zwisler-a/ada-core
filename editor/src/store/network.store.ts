import { Store } from './store';
import {
  CoreService,
  NetworkDto,
  NodeInstanceDto,
} from '../../openapi-typescript-codegen';
import { filter, map, OperatorFunction, tap } from 'rxjs';

export const networksStore = new Store(CoreService.getAllNetworks);

export const networkSelector = (id) =>
  map((networks: NetworkDto[]) =>
    networks.find((network) => network.identifier === id),
  );
export const nodeSelector: (
  networkId: string,
  nodeId: string,
) => OperatorFunction<NetworkDto[], NodeInstanceDto> =
  (networkId, nodeId) => (source$) =>
    source$.pipe(
      networkSelector(networkId),
      tap(console.log),
      filter((network) => !!network),
      map((network) =>
        network.nodes.find((node) => node.identifier === nodeId),
      ),
    );
