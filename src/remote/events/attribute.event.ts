import { DataHolder } from '../../domain';
import { IOEvent } from './io.event';

export interface AttributeEvent extends IOEvent {
  attributeIdentifier: string;
  value: DataHolder;
}
