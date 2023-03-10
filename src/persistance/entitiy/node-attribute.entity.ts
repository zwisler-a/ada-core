import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { NodeEntity } from './node.entitiy';

@Entity()
export class NodeAttributeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  attributeDefinitionId: string;
  @Column({ default: '' })
  value: string;

  @ManyToOne((type) => NodeEntity, (object) => object.attributes, {
    orphanedRowAction: 'delete',
  })
  node: NodeEntity;
}
