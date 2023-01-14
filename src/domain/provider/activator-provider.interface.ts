import { Observable } from 'rxjs';
import { ActivatorTriggerDefinition } from 'src/domain/devices/activator-trigger-definition';

export interface ActivatorProvider {
  getActivatorTriggerObservable(): Observable<{
    definition: ActivatorTriggerDefinition;
    value: object;
  }>;
}
