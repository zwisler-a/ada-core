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
    console.log(networkEntity);
    const entity = await this.networkRepo.save(networkEntity);
    return this.networkMapper.entityToNetwork(entity);
  }

  async find() {
    const nodes = await this.networkRepo.find();
    return Promise.all(nodes.map(this.networkMapper.entityToNetwork));
  }

  async findBy(identifier: string) {
    const network = await this.networkRepo.findOneBy({ id: identifier });
    console.log(network.nodes);
    return this.networkMapper.entityToNetwork(network);
  }
}
