import { IOEvent } from './io.event';

export interface DestroyInstanceEvent extends IOEvent {
  connectorIdentifier: string;
}
