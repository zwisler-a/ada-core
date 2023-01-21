import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class GoogleDeviceEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @Column({ type: 'text' })
  traits: string;
  @Column()
  willReportState: boolean;
  @Column()
  type: string;
  @Column({ type: 'text' })
  attributes: string;
  @Column({ type: 'text' })
  customData: string;
  @Column({ type: 'text' })
  deviceInfo: string;
  @Column({ type: 'text' })
  otherDeviceIds: string;
  @Column()
  roomHint: string;
}
