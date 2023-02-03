import { Injectable, Logger } from '@nestjs/common';
import { Network } from '../../domain';
import { PersistenceService } from '../../persistance';
import { NetworkMapper } from '../mapper/network.mapper';
import { NetworkStateRepresentation } from '../../persistance/dto/network-state.representation';
import { NetworkStateMapper } from '../mapper/network-state.mapper';

@Injectable()
export class NetworkExecutionService {
  private logger: Logger = new Logger(NetworkExecutionService.name);
  private networks: Network[] = [];

  constructor(
    private persistenceService: PersistenceService,
    private networkMapper: NetworkMapper,
    private networkStateMapper: NetworkStateMapper,
  ) {}

  private isNetworkRunning(id: string) {
    const inMemoryNetwork = this.networks.find(
      (network) => network.identifier === id,
    );
    return !!inMemoryNetwork;
  }

  private getRunningNetwork(id: string) {
    return this.networks.find((network) => network.identifier === id);
  }

  private removeRunningNetwork(id: string) {
    this.networks = this.networks.filter((n) => n.identifier !== id);
  }

  async executeNetworkById(networkId: string) {
    if (this.isNetworkRunning(networkId)) {
      this.logger.debug('Network is already running!');
      return true;
    } else {
      this.logger.debug(`Retrieving Network from DB ...`);
      const networkRepresentation = await this.persistenceService.findById(
        networkId,
      );
      if (!networkRepresentation) {
        this.logger.debug(`Unable to find network ${networkId}.`);
        return false;
      }
      this.logger.debug(`Fetching network state ...`);
      let networkState = await this.persistenceService.getStateByNetworkId(
        networkId,
      );
      if (!networkState) {
        this.logger.debug(`Creating empty state ...`);
        networkState = new NetworkStateRepresentation();
      }
      this.logger.debug(`Creating network from representation ...`);
      const network = await this.networkMapper.createNetwork(
        networkRepresentation,
        this.networkStateMapper.representationToState(networkState),
      );
      this.networks.push(network);
      network.start();
      return true;
    }
  }

  async stopNetworkById(networkId: string) {
    if (this.isNetworkRunning(networkId)) {
      this.logger.debug(`Stopping network with id ${networkId}!`);
      const network = this.getRunningNetwork(networkId);
      network.stop();
      this.removeRunningNetwork(networkId);
    } else {
      this.logger.debug(`Network is not running!`);
    }
    return true;
  }

  getRunning() {
    return this.networks;
  }
}
