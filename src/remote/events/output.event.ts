import { DataHolder } from '../../domain';
import { IOEvent } from './io.event';

export interface OutputEvent extends IOEvent {
  outputIdentifier: string;
  value: DataHolder;
}
