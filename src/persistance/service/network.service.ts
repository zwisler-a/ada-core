import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Network } from "src/domain/engine/network";
import { Repository } from "typeorm";
import { NetworkEntity } from "../entities/network.entity";
import { NetworkMapper } from "../mapper/network-mapper.service";

@Injectable()
export class NetworkService {

    constructor(
        @InjectRepository(NetworkEntity) private networkRepo: Repository<NetworkEntity>,
        private networkMapper: NetworkMapper
    ) { }

    saveNetwork(network: Network) {
        this.networkRepo.save(this.networkMapper.mapNetworkToNetworkEntitiy(network))
    }

    async getNetworks() {
        const networks = await this.networkRepo.find()
        return networks.map(n => this.networkMapper.mapNetworkEntityToNetwork(n))
    }

}