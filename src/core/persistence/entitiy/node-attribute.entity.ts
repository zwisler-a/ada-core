import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { NodeEntity } from './node.entitiy';

@Entity()
export class NodeAttributeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  attributeDefinitionId: string;
  @Column({ default: '' })
  value: string;

  @ManyToOne((type) => NodeEntity, (object) => object.attributes)
  node: NodeEntity;
}
