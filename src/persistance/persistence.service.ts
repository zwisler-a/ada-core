import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NetworkEntity } from './entitiy/network.entity';
import { Repository } from 'typeorm';
import { NetworkRepresentation } from './dto/network.dto';
import { NetworkMapperService } from './mapper/network-mapper.service';
import { rethrow } from '@nestjs/core/helpers/rethrow';

@Injectable()
export class PersistenceService {
  constructor(
    @InjectRepository(NetworkEntity)
    private networkRepo: Repository<NetworkEntity>,
    private networkMapper: NetworkMapperService,
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
