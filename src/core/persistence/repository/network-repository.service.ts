import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Network } from '../../../domain/node/network';
import { NetworkEntity } from '../entitiy/network.entity';
import { NetworkMapperService } from '../mapper/network-mapper.service';

@Injectable()
export class NetworkRepository {
  constructor(
    private networkMapper: NetworkMapperService,
    @InjectRepository(NetworkEntity)
    private networkRepo: Repository<NetworkEntity>,
  ) {}

  async save(network: Network) {
    const networkEntity = this.networkMapper.networkToEntity(network);
    const entity = await this.networkRepo.save(networkEntity);
    return this.networkMapper.entityToNetwork(entity);
  }

  async find() {
    const nodes = await this.networkRepo.find();
    return Promise.all(
      nodes.map((node) => this.networkMapper.entityToNetwork(node)),
    );
  }

  async findBy(identifier: string) {
    const network = await this.networkRepo.findOneBy({ id: identifier });
    return this.networkMapper.entityToNetwork(network);
  }

  async deleteBy(id: string) {
    await this.networkRepo.save({ id, nodes: [], edges: [] } as any);
    return this.networkRepo.delete({ id });
  }
}
