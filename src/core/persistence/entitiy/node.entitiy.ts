import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EdgeEntity } from './edge.entity';
import { NetworkEntity } from './network.entity';
import { NodeAttributeEntity } from './node-attribute.entity';

@Entity()
export class NodeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  definitionId: string;
  @Column({ default: '' })
  name: string;
  @Column({ default: '' })
  description: string;

  @ManyToOne((type) => NetworkEntity, (object) => object.nodes)
  network: NetworkEntity;

  @OneToMany((type) => EdgeEntity, (object) => object.outputNode, {
    cascade: true,
  })
  outputEdges: EdgeEntity[];

  @OneToMany((type) => EdgeEntity, (object) => object.inputNode, {
    cascade: true,
  })
  inputEdges: EdgeEntity[];

  @OneToMany((type) => NodeAttributeEntity, (object) => object.node, {
    cascade: true,
  })
  attributes: NodeAttributeEntity[];
}
