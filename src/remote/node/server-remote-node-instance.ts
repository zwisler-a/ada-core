import { RemoteApiService } from '../service/remote-api.service';
import { filter, Observable } from 'rxjs';
import {
  AttributeEvent,
  DataHolder,
  IOEvent,
  IOEventType,
  NodeDefinition,
  NodeInstance,
  NodeState,
  OutputEvent,
} from '@zwisler/ada-lib';

export class ServerRemoteNodeInstance extends NodeInstance {
  private instanceUpdates$: Observable<IOEvent>;
  private isActive = true;

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
        this.updateOutput(event.outputIdentifier, JSON.parse(event.value)),
      );

    this.instanceUpdates$
      .pipe(filter((io) => io.type === IOEventType.ATTRIBUTE))
      .subscribe((event: AttributeEvent) =>
        this.updateAttribute(
          event.attributeIdentifier,
          JSON.parse(event.value),
        ),
      );
  }

  handleInput(input: string, data: DataHolder) {
    if (!this.isActive) return;
    this.api.updateInput(
      this.connectorIdentifier,
      this.remoteIdentifier,
      input,
      JSON.stringify(data),
    );
  }

  onAttributeChange(identifier: string, value: DataHolder) {
    if (!this.isActive) return;
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

  connectorTimeout() {
    this.name = 'Not available!';
    this.isActive = false;
  }
}
