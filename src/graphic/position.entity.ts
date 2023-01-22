import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PositionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ default: 0 })
  x: number;
  @Column({ default: 0 })
  y: number;
}
