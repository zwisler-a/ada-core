import { RemoteNodeApiService } from '../service/remote-node-api.service';
import { filter, Observable } from 'rxjs';
import {
  AttributeEvent,
  DataHolder,
  Identifiable,
  IOEvent,
  IOEventType,
  NodeDefinition,
  NodeInstance,
  NodeState,
  OutputEvent,
} from '@zwisler/ada-lib';

export class ServerRemoteNodeInstance extends NodeInstance {
  private instanceUpdates$: Observable<IOEvent>;

  constructor(
    identifier: Identifiable,
    definition: NodeDefinition,
    state: NodeState,
    private connectorIdentifier: string,
    private api: RemoteNodeApiService,
  ) {
    super(identifier, definition, state);
    this.init();
  }

  async init() {
    await this.api.createInstance(
      this.identifier,
      this.connectorIdentifier,
      this.definition.identifier,
      this.state,
    );
    this.instanceUpdates$ = this.api.createInstanceObservable(
      this.connectorIdentifier,
      this.identifier,
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
    this.api.updateInput(
      this.connectorIdentifier,
      this.identifier,
      input,
      JSON.stringify(data),
    );
  }

  /* onAttributeChange(identifier: string, value: DataHolder) {
    if (!this.isActive) return;
    this.api.updateAttribute(
      this.connectorIdentifier,
      this.identifier,
      identifier,
      JSON.stringify(value),
    );
  } */

  deconstruct() {
    this.api.destroyInstance(this.connectorIdentifier, this.identifier);
  }
}
