import {
  Identifiable,
  NodeDefinition,
  NodeInstance,
  NodeState,
} from '../domain';
import { RemoteApiService } from './remote-api.service';
import { filter, MonoTypeOperatorFunction, Subscription, tap } from 'rxjs';
import {
  AttributeEvent,
  DestroyInstanceEvent,
  InputEvent,
  IOEvent,
  IOEventType,
} from '../events';
import { Logger } from '../logger';

export class InstanceManagerService {
  private instances: { [nodeInstanceId: string]: NodeInstance } = {};

  constructor(private logger: Logger, private apiService: RemoteApiService) {}

  isRegistered(nodeInstanceId: string) {
    return this.instances[nodeInstanceId];
  }

  watchForInstantiation(connectorId: string, nodeDefinition: NodeDefinition) {
    this.apiService
      .createInstantiationObservable(connectorId, nodeDefinition.identifier)
      .subscribe(async (event) => {
        this.logger.log(
          `Creating node for ${nodeDefinition.identifier} with id  ${event.nodeInstanceIdentifier}`,
        );
        const instance = await nodeDefinition.createInstance(
          NodeState.from(event.state),
          Identifiable.create(event.nodeInstanceIdentifier),
        );
        instance.identifier = event.nodeInstanceIdentifier;
        this.instances[instance.identifier] = instance;

        this.createLifecycleHooks(connectorId, instance);
        this.createOutputHooks(connectorId, instance);
      });
  }

  private createLifecycleHooks(connectorId: string, instance: NodeInstance) {
    const instanceSubscriptions = new Subscription();
    const instance$ = this.apiService
      .createInstanceObservable(connectorId, instance.identifier)
      .pipe(this.unknownInstancePipe(connectorId));

    const inputSubscription = instance$
      .pipe(filter((ev: IOEvent) => ev.type === IOEventType.INPUT))
      .subscribe((ev: InputEvent) => {
        instance.handleInput(ev.inputIdentifier, JSON.parse(ev.value));
      });
    instanceSubscriptions.add(inputSubscription);

    const attributeSubscription = instance$
      .pipe(filter((ev: IOEvent) => ev.type === IOEventType.ATTRIBUTE))
      .subscribe((ev: AttributeEvent) => {
        instance.onAttributeChange(
          ev.attributeIdentifier,
          JSON.parse(ev.value),
        );
      });
    instanceSubscriptions.add(attributeSubscription);

    const destroySubscription = instance$
      .pipe(filter((ev: IOEvent) => ev.type === IOEventType.DESTROY))
      .subscribe((event: DestroyInstanceEvent) => {
        this.instances[event.nodeInstanceIdentifier].deconstruct();
        instanceSubscriptions.unsubscribe();
        this.logger.log(`Destroy node with id ${event.nodeInstanceIdentifier}`);
      });
    instanceSubscriptions.add(destroySubscription);
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

  private unknownInstancePipe(
    connectorId: string,
  ): MonoTypeOperatorFunction<IOEvent> {
    return (source$) =>
      source$.pipe(
        filter((event) => event.connectorIdentifier === connectorId),
        tap((event) => {
          if (!this.isRegistered(event.nodeInstanceIdentifier)) {
            this.logger.log('Unknown instance ... what now?');
          }
        }),
      );
  }
}
