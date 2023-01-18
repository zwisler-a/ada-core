import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ConnectionEntity } from "./connection.entity";
import { NodeEntity } from "./node.entity";

@Entity()
export class NetworkEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @OneToMany(type => NodeEntity, node => node.network)
    nodes: NodeEntity[];

    @OneToMany(type => ConnectionEntity, connection => connection.network)
    connections: ConnectionEntity[];
}
