import { ActionParameterDefinition } from 'src/domain/devices/action-parameter-definition';
import { ActorProvider } from 'src/domain/provider/actor-provider.interface';

export class TestActor implements ActorProvider {
  execute(action: ActionParameterDefinition, value: object) {
    console.log(action, value);
    throw new Error('Method not implemented.');
  }
}
