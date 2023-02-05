import { IOEvent } from './io.event';
import { NodeStateSnapshot } from '../domain';

export interface CreateInstanceEvent extends IOEvent {
  connectorIdentifier: string;
  definitionIdentifier: string;
  state: NodeStateSnapshot;
}
