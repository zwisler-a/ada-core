import { DataHolder, NodeDefinition, NodeInstance } from '../../domain';
import { RemoteApiService } from '../service/remote-api.service';
import { filter, Observable } from 'rxjs';
import { IOEvent } from '../events/io.event';
import { OutputEvent } from '../events/output.event';
import { AttributeEvent } from '../events/attribute.event';

export class RemoteNodeInstance extends NodeInstance {
  private instanceUpdates$: Observable<IOEvent>;

  constructor(
    definition: NodeDefinition,
    private remoteIdentifier: string,
    private connectorIdentifier: string,
    private api: RemoteApiService,
  ) {
    super(definition);
    this.instanceUpdates$ = this.api.createInstanceObservable(
      this.connectorIdentifier,
      this.remoteIdentifier,
    );
    this.instanceUpdates$
      .pipe(filter((io) => io.type === 'OUTPUT'))
      .subscribe((event: OutputEvent) =>
        this.updateOutput(event.outputIdentifier, event.value),
      );

    this.instanceUpdates$
      .pipe(filter((io) => io.type === 'ATTRIBUTE'))
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
