import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { NodeEntity } from './node.entitiy';
import { NetworkEntity } from './network.entity';

@Entity()
export class EdgeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: '' })
  name: string;
  @Column({ default: '' })
  description: string;
  @Column()
  outputIdentifier: string;
  @Column()
  inputIdentifier: string;

  @ManyToOne((type) => NetworkEntity, (object) => object.nodes)
  network: NetworkEntity;

  @ManyToOne((type) => NodeEntity, (object) => object.outputEdges, {
    eager: true,
  })
  outputNode: NodeEntity;
  @ManyToOne((type) => NodeEntity, (object) => object.inputEdges, {
    eager: true,
  })
  inputNode: NodeEntity;
}
