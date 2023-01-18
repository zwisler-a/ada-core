import { ChildEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, TableInheritance } from "typeorm";
import { ConnectionEntity } from "./connection.entity";
import { NetworkEntity } from "./network.entity";

@Entity()
@TableInheritance({ column: { type: "varchar", name: "type" } })
export class NodeEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @ManyToOne(type => NetworkEntity, network => network.nodes)
    network: NetworkEntity;

    @OneToMany(type => ConnectionEntity, connection => connection.inputNode)
    inputConnections: ConnectionEntity[];

    @OneToMany(type => ConnectionEntity, connection => connection.outputNode)
    outputConnections: ConnectionEntity[];
}

@ChildEntity()
export class DeviceNodeEntity extends NodeEntity {
    @Column()
    deviceIdentifier: string
}

@ChildEntity()
export class MapperNodeEntity extends NodeEntity {
    @Column()
    mapperFunc: string
}