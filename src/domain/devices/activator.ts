import { ActivatorTriggerDefinition } from './activator-trigger-definition';
import { DeviceTrait } from './device-trait';

export class Activator extends DeviceTrait {
  triggers: ActivatorTriggerDefinition[];
}
