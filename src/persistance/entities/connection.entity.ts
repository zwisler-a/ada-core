import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { NetworkEntity } from "./network.entity";
import { NodeEntity } from "./node.entity";

@Entity()
export class ConnectionEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nodeInputIdentifier: string;

    @Column()
    nodeOutputIdentifier: string;

    @ManyToOne(type => NodeEntity, node => node.inputConnections)
    inputNode: NodeEntity;

    @ManyToOne(type => NodeEntity, node => node.outputConnections)
    outputNode: NodeEntity;

    @ManyToOne(type => NetworkEntity, network => network.connections)
    network: NetworkEntity;
}