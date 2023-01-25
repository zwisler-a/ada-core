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
    const inMemoryNetwork = this.networks.find(
      (network) => network.identifier === networkId,
    );
    if (inMemoryNetwork && !inMemoryNetwork.isActive) {
      this.logger.debug('Executing Network from memory ...');
      inMemoryNetwork.start();
      await this.networkRepo.save(inMemoryNetwork);
      return true;
    }
    if (!inMemoryNetwork) {
      this.logger.debug(`Retrieving Network from DB ...`);
      const dbNetwork = await this.networkRepo.findBy(networkId);
      this.networks.push(dbNetwork);
      if (dbNetwork.isActive) {
        this.logger.debug(
          'Network got into an inconsistent state. Not in memory but active in BD!',
        );
      }
      this.logger.debug('Executing Network from DB ...');
      dbNetwork.start();
      await this.networkRepo.save(inMemoryNetwork);
      return true;
    }
    this.logger.debug(`Could not start network ${inMemoryNetwork.identifier}!`);
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
    } else {
      const dbNetwork = await this.networkRepo.findBy(networkId);
      if (dbNetwork.isActive) {
        this.logger.debug(
          `Inconsistent state between DB and Service. Stopping and saving network!`,
        );
        dbNetwork.stop();
        await this.networkRepo.save(dbNetwork);
        return true;
      }
    }
    return !!network;
  }

  getRunning() {
    return this.networks;
  }
}
