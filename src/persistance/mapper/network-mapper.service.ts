import { Injectable } from "@nestjs/common";
import { Network } from "../../domain/engine/network";
import { NetworkEntity } from "../entities/network.entity";
import { ConnectionMapper } from "./connection-mapper.service";
import { NodeMapper } from "./node-mapper.service";


@Injectable()
export class NetworkMapper {

    constructor(
        private nodeMapper: NodeMapper,
        private connectionMapper: ConnectionMapper
    ) { }

    async mapNetworkEntityToNetwork(networkEntity: NetworkEntity): Promise<Network> {
        const nodes = await Promise.all(networkEntity.nodes.map(n => this.nodeMapper.mapNodeEntityToNode(n)));
        return new Network(
            networkEntity.id,
            networkEntity.name,
            networkEntity.description,
            nodes,
            networkEntity.connections.map(c => this.connectionMapper.mapConnectionEntityToConnection(c, nodes))
        )
    }

    mapNetworkToNetworkEntitiy(network: Network): NetworkEntity {
        const entity = new NetworkEntity();
        entity.id = network.identifier;
        entity.name = network.name;
        entity.description = network.description;
        entity.connections = network.connections.map(c => this.connectionMapper.mapConnectionToConnectionEntity(c));
        entity.nodes = network.nodes.map(n => this.nodeMapper.mapNodeToNodeEntity(n));
        return entity;
    }
}