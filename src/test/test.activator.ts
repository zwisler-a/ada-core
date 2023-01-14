import { Observable, Subject } from 'rxjs';
import { ActivatorTriggerDefinition } from 'src/domain/devices/activator-trigger-definition';
import { ActivatorProvider } from 'src/domain/provider/activator-provider.interface';

export class TestActivator implements ActivatorProvider {
  getActivatorTriggerObservable(): Observable<{
    definition: ActivatorTriggerDefinition;
    value: object;
  }> {
    return new Subject();
  }
}
