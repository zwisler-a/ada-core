import { IOEvent } from './io.event';

export interface CreateInstanceEvent extends IOEvent {
  connectorIdentifier: string;
  definitionIdentifier: string;
  state: { [attributeId: string]: any };
}
