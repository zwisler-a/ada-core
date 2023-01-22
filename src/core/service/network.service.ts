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

  async save(network: Network): Promise<Network> {
    const loadedNetwork = this.networks.find(
      (nw) => nw.identifier === network.identifier,
    );
    if (loadedNetwork) {
      loadedNetwork.stop();
      this.networks = this.networks.filter(
        (network) => network.identifier !== network.identifier,
      );
    }
    return await this.networkRepo.save(network);
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
      await this.networkRepo.save(loadedNetwork);
      return true;
    }
    return false;
  }

  findOne(id: string) {
    return this.networkRepo.findBy(id);
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
      this.networks = this.networks.filter((n) => n.identifier !== networkId);
      await this.networkRepo.save(network);
    }
    return !!network;
  }

  getRunning() {
    return this.networks;
  }
}
