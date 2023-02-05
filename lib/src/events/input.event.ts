import { IOEvent } from './io.event';

export interface InputEvent extends IOEvent {
  inputIdentifier: string;
  value: string;
}
