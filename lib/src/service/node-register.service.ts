import { RemoteApiService } from './remote-api.service';
import { AmqpService } from './amqp.service';
import {
  AttributeEvent,
  DestroyInstanceEvent,
  InputEvent,
  IOEvent,
  IOEventType,
} from '../events';
import { filter, Subscription } from 'rxjs';
import { NodeDefinition, NodeInstance, NodeState } from '../domain';

export class NodeRegisterService {
  private healthPingIntervalRef: any;

  constructor(
    private amqp: AmqpService,
    private apiService: RemoteApiService,
  ) {}

  private instances: { [nodeInstanceId: string]: NodeInstance } = {};

  async register(
    nodes: NodeDefinition[],
    connectorId: string,
    name: string,
    description: string,
  ) {
    await this.amqp.ready;
    console.log('Registering ', connectorId);
    nodes.forEach((node) => {
      this.apiService
        .createInstanceCreateObservable(connectorId, node.identifier)
        .subscribe(async (event) => {
          const instance = await node.createInstance(
            NodeState.from(event.state),
          );
          instance.identifier = event.nodeInstanceIdentifier;
          this.instances[instance.identifier] = instance;

          this.createLifecycleHooks(connectorId, instance);
          this.createOutputHooks(connectorId, instance);
        });
    });
    if (this.healthPingIntervalRef) clearInterval(this.healthPingIntervalRef);
    this.healthPingIntervalRef = setInterval(() => {
      this.amqp.sendConnector(connectorId, name, description, nodes);
    }, 5000);
  }

  private createLifecycleHooks(connectorId: string, instance: NodeInstance) {
    const instanceSubscriptions = new Subscription();
    const instance$ = this.apiService.createInstanceObservable(
      connectorId,
      instance.identifier,
    );
    instanceSubscriptions.add(
      instance$
        .pipe(filter((ev: IOEvent) => ev.type === IOEventType.INPUT))
        .subscribe((ev: InputEvent) => {
          instance.handleInput(ev.inputIdentifier, JSON.parse(ev.value));
        }),
    );

    instanceSubscriptions.add(
      instance$
        .pipe(filter((ev: IOEvent) => ev.type === IOEventType.ATTRIBUTE))
        .subscribe((ev: AttributeEvent) => {
          instance.onAttributeChange(
            ev.attributeIdentifier,
            JSON.parse(ev.value),
          );
        }),
    );
    instance$
      .pipe(filter((ev: IOEvent) => ev.type === IOEventType.DESTROY))
      .subscribe((event: DestroyInstanceEvent) => {
        this.instances[event.nodeInstanceIdentifier].deconstruct();
        instanceSubscriptions.unsubscribe();
      });
  }

  private createOutputHooks(connectorId: string, instance: NodeInstance) {
    instance.updateAttribute = (identifier, value) => {
      this.apiService.updateAttribute(
        connectorId,
        instance.identifier,
        identifier,
        JSON.stringify(value),
      );
      return true;
    };
    instance.updateOutput = (identifier, value) => {
      this.apiService.updateOutput(
        connectorId,
        instance.identifier,
        identifier,
        JSON.stringify(value),
      );
      return true;
    };
  }
}
