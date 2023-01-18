import { Subject } from '../observable';
import { ActionDefinition } from './action-definition';
import { SensorDataDefinition } from './sensor-data-definition';

export class Device {
  identifier: string;

  synced: boolean;
  name: string;
  description: string;

  actorDefinition?: ActionDefinition[];
  sensorDefinition?: SensorDataDefinition[];

  updateSensor = new Subject<{ definition: SensorDataDefinition, data: any }>();
  execute(definition: ActionDefinition, data: any) { }
}
