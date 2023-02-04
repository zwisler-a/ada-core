import {
  DataHolder,
  NodeDefinition,
  NodeInstance,
  NodeState,
} from '../../domain';
import { RemoteApiService } from '../service/remote-api.service';
import { filter, Observable } from 'rxjs';
import {
  AttributeEvent,
  IOEvent,
  IOEventType,
  OutputEvent,
} from '@ada/remote-lib';

export class RemoteNodeInstance extends NodeInstance {
  private instanceUpdates$: Observable<IOEvent>;

  constructor(
    definition: NodeDefinition,
    state: NodeState,
    private remoteIdentifier: string,
    private connectorIdentifier: string,
    private api: RemoteApiService,
  ) {
    super(definition, state);
    this.instanceUpdates$ = this.api.createInstanceObservable(
      this.connectorIdentifier,
      this.remoteIdentifier,
    );
    this.instanceUpdates$
      .pipe(filter((io) => io.type === IOEventType.OUTPUT))
      .subscribe((event: OutputEvent) =>
        this.updateOutput(event.outputIdentifier, event.value),
      );

    this.instanceUpdates$
      .pipe(filter((io) => io.type === IOEventType.ATTRIBUTE))
      .subscribe((event: AttributeEvent) =>
        this.updateAttribute(event.attributeIdentifier, event.value),
      );
  }

  handleInput(input: string, data: DataHolder) {
    this.api.updateInput(
      this.connectorIdentifier,
      this.remoteIdentifier,
      input,
      JSON.stringify(data),
    );
  }

  onAttributeChange(identifier: string, value: DataHolder) {
    this.api.updateAttribute(
      this.connectorIdentifier,
      this.remoteIdentifier,
      identifier,
      JSON.stringify(value),
    );
  }

  deconstruct() {
    this.api.destroyInstance(this.connectorIdentifier, this.remoteIdentifier);
  }
}
