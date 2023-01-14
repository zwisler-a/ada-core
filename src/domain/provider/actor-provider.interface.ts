import { ActionParameterDefinition } from 'src/domain/devices/action-parameter-definition';

export interface ActorProvider {
  execute(action: ActionParameterDefinition, value: object);
}
