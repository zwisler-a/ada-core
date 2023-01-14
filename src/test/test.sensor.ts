import { Observable, Subject } from 'rxjs';
import { SensorDataDefinition } from 'src/domain/devices/sensor-data-definition';
import { SensorProvider } from 'src/domain/provider/sensor-provider.interface';

export class TestSensor implements SensorProvider {
  getSensorDataObservable(): Observable<{
    definition: SensorDataDefinition;
    value: object;
  }> {
    return new Subject();
  }
}
