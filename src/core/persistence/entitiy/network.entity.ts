import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { NodeEntity } from './node.entitiy';
import { EdgeEntity } from './edge.entity';

@Entity()
export class NetworkEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: false })
  active: boolean;

  @Column({ default: '' })
  name: string;
  @Column({ default: '' })
  description: string;

  @OneToMany((type) => NodeEntity, (object) => object.network, {
    eager: true,
    cascade: true,
  })
  nodes: NodeEntity[];
  @OneToMany((type) => EdgeEntity, (object) => object.network, {
    eager: true,
    cascade: true,
  })
  edges: EdgeEntity[];
}
