import { Injectable, Logger } from '@nestjs/common';
import { Network } from '../../domain/node/network';
import { NetworkRepository } from '../persistence/repository/network-repository.service';

@Injectable()
export class NetworkService {
  private logger: Logger = new Logger(NetworkService.name);
  private networks: Network[] = [];

  constructor(private networkRepo: NetworkRepository) {}

  getAll() {
    return this.networkRepo.find();
  }

  save(network: Network): Promise<Network> {
    return this.networkRepo.save(network);
  }

  async executeNetworkById(networkId: string) {
    let loadedNetwork = this.networks.find(
      (network) => network.identifier === networkId,
    );
    if (!loadedNetwork) {
      loadedNetwork = await this.networkRepo.findBy(networkId);
      this.networks.push(loadedNetwork);
    }
    if (loadedNetwork && !loadedNetwork.isActive) {
      this.logger.debug(
        `Executing network with id ${loadedNetwork.identifier}!`,
      );
      loadedNetwork.start();
      await this.save(loadedNetwork);
      return true;
    }
    return false;
  }

  delete(id: string) {
    const network = this.networks.find((network) => network.identifier === id);
    this.networks = this.networks.filter(
      (network) => network.identifier !== id,
    );
    if (network) {
      network.stop();
    }
    this.logger.debug(`Deleting network with id ${id}!`);
    return this.networkRepo.deleteBy(id);
  }

  async stopNetworkById(networkId: string) {
    const network = this.networks.find(
      (network) => network.identifier === networkId,
    );
    if (network) {
      this.logger.debug(`Stopping network with id ${network.identifier}!`);
      network.stop();
      await this.save(network);
    }
    return !!network;
  }

  getRunning() {
    return this.networks;
  }
}
