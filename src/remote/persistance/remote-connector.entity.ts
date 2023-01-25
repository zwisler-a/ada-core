import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RemoteConnectorEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @Column()
  description: string;
  @Column()
  url: string;
}
