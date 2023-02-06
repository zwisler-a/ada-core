import { Injectable, Logger } from '@nestjs/common';
import { PersistenceService } from '../../persistance';
import { NetworkMapper } from '../mapper/network.mapper';
import { NetworkStateRepresentation } from '../../persistance/dto/network-state.representation';
import { NetworkStateMapper } from '../mapper/network-state.mapper';
import { Network } from '@zwisler/ada-lib';

@Injectable()
export class NetworkExecutionService {
  private logger: Logger = new Logger(NetworkExecutionService.name);
  private networks: {
    [networkId: string]: {
      network: Network;
      stateSubscription: any;
    };
  } = {};

  constructor(
    private persistenceService: PersistenceService,
    private networkMapper: NetworkMapper,
    private networkStateMapper: NetworkStateMapper,
  ) {}

  private isNetworkRunning(id: string) {
    return !!this.networks[id];
  }

  private getRunningNetwork(id: string) {
    return this.networks[id];
  }

  private removeRunningNetwork(id: string) {
    delete this.networks[id];
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
      const state = this.networkStateMapper.representationToState(networkState);
      this.logger.debug(`Creating network from representation ...`);
      const network = await this.networkMapper.createNetwork(
        networkRepresentation,
        state,
      );
      this.logger.debug(`Initialize with ${JSON.stringify(state.snapshot())}`);
      const stateSubscription = network.state.subscribe((state) => {
        this.persistenceService.saveState(
          networkId,
          this.networkStateMapper.stateToRepresentation(state),
        );
      });
      this.networks[networkId] = { network, stateSubscription };
      network.start();
      return true;
    }
  }

  async stopNetworkById(networkId: string) {
    if (this.isNetworkRunning(networkId)) {
      this.logger.debug(`Stopping network with id ${networkId}!`);
      const { network, stateSubscription } = this.getRunningNetwork(networkId);
      network.stop();
      stateSubscription.unsubscribe();
      this.removeRunningNetwork(networkId);
    } else {
      this.logger.debug(`Network is not running!`);
    }
    return true;
  }

  getRunning() {
    return Object.keys(this.networks);
  }
}
