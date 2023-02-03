import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NetworkEntity } from './entitiy/network.entity';
import { Repository } from 'typeorm';
import { NetworkRepresentation } from './dto/network.dto';
import { NetworkMapperService } from './mapper/network-mapper.service';
import { NetworkStateRepresentation } from './dto/network-state.representation';
import { NetworkStateMapperService } from './mapper/network-state-mapper.service';

@Injectable()
export class PersistenceService {
  constructor(
    @InjectRepository(NetworkEntity)
    private networkRepo: Repository<NetworkEntity>,
    private networkMapper: NetworkMapperService,
    private networkStateMapper: NetworkStateMapperService,
  ) {}

  async save(network: NetworkRepresentation) {
    const saved = await this.networkRepo.save(
      this.networkMapper.networkToEntity(network),
    );
    return this.networkMapper.entityToNetwork(saved);
  }

  async findById(id: string) {
    const saved = await this.networkRepo.findOneBy({ id });
    return this.networkMapper.entityToNetwork(saved);
  }

  async getStateByNetworkId(id: string): Promise<NetworkStateRepresentation> {
    const saved = await this.networkRepo.findOneBy({ id });
    return this.networkStateMapper.entityToState(saved);
  }

  async saveState(networkId: string, state: NetworkStateRepresentation) {
    const network = await this.networkRepo.findOneBy({ id: networkId });
    const updated = this.networkStateMapper.stateToEntity(network, state);
    return this.networkStateMapper.entityToState(
      await this.networkRepo.save(updated),
    );
  }

  async getAll() {
    const networkEntities = await this.networkRepo.find();
    return networkEntities.map((network) =>
      this.networkMapper.entityToNetwork(network),
    );
  }

  async delete(id: string) {
    await this.networkRepo.save({ id, nodes: [], edges: [] });
    return this.networkRepo.delete({ id });
  }
}
