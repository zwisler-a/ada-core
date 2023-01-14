import { Observable } from 'rxjs';
import { SensorDataDefinition } from 'src/domain/devices/sensor-data-definition';

export interface SensorProvider {
  getSensorDataObservable(): Observable<{
    definition: SensorDataDefinition;
    value: object;
  }>;
}
