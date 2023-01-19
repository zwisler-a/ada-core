import { Subject } from '../observable';
import { ActionDefinition } from './action-definition';
import { DeviceTrait } from './device-traits';
import { DeviceType } from './device-types';
import { SensorDataDefinition } from './sensor-data-definition';

export class Device {
  identifier: string;

  synced: boolean;
  name: string;
  description: string;

  type: DeviceType;
  traits: DeviceTrait[];

  actorDefinition?: ActionDefinition[];
  sensorDefinition?: SensorDataDefinition[];

  updateSensor = new Subject<{ definition: SensorDataDefinition, data: any }>();
  execute(definition: ActionDefinition, data: any) { }
}
