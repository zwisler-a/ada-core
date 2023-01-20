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
    }
    if (loadedNetwork) {
      loadedNetwork.start();
      return true;
    }
    return false;
  }
}
