import { Injectable } from "@nestjs/common";
import { Connection } from "../../domain/engine/connection";
import { Node } from "../../domain/engine/node";
import { ConnectionEntity } from "../entities/connection.entity";
import { NodeMapper } from "./node-mapper.service";

@Injectable()
export class ConnectionMapper {


    constructor(private nodeMapper: NodeMapper) { }

    mapConnectionEntityToConnection(connectionEntity: ConnectionEntity, nodes: Node[]): Connection {
        const outputNode = nodes.find(node => node.identifier === connectionEntity.outputNode.id);
        const inputNode = nodes.find(node => node.identifier === connectionEntity.inputNode.id);
        if(!outputNode || ! inputNode) console.log('fuck', inputNode, outputNode)
        return new Connection(
            connectionEntity.id,
            inputNode.getOutputByName(connectionEntity.nodeOutputIdentifier),
            outputNode.getInputByName(connectionEntity.nodeInputIdentifier)
            , inputNode, outputNode
        )
    }

    mapConnectionToConnectionEntity(connection: Connection): ConnectionEntity {
        const entity = new ConnectionEntity();
        entity.id = connection.identifier;
        entity.inputNode = this.nodeMapper.mapNodeToNodeEntity(connection.inputNode);
        entity.outputNode = this.nodeMapper.mapNodeToNodeEntity(connection.outputNode);
        entity.nodeInputIdentifier = connection.input.name;
        entity.nodeOutputIdentifier = connection.output.name;
        return entity;
    }
}

