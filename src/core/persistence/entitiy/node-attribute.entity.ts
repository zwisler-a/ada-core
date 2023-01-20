import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { NodeEntity } from './node.entitiy';

@Entity()
export class NodeAttributeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  attributeDefinitionId: string;
  @Column()
  value: string;

  @OneToMany((type) => NodeEntity, (object) => object.attributes)
  node: NodeEntity;
}
