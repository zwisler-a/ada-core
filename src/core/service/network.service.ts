import { Injectable } from '@nestjs/common';
import { Network } from '../../domain/node/network';
import { NetworkRepository } from '../persistence/repository/network-repository.service';

@Injectable()
export class NetworkService {
  private networks: Network[] = [];

  constructor(private networkRepo: NetworkRepository) {}

  getAll() {
    return this.networkRepo.find();
  }

  executeNetwork(network: Network) {
    this.networks.push(network);
    network.start();
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
    if (loadedNetwork) {
      loadedNetwork.start();
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
    return this.networkRepo.deleteBy(id);
  }

  stopNetworkById(networkId: string) {
    const network = this.networks.find(
      (network) => network.identifier === networkId,
    );
    if (network) network.stop();
    return !!network;
  }

  getRunning() {
    return this.networks;
  }
}
