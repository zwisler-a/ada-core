import { DataHolder, NodeInstance, NodeState } from '@zwisler/ada-lib';
import { Logger } from '@nestjs/common';
import { ServerNodeHolderDefinition } from './server-node-holder-definition';

export class ServerNodeHolderInstance extends NodeInstance {
  private logger = new Logger(ServerNodeHolderInstance.name);
  private connected = false;

  constructor(
    private instance: NodeInstance,
    public definition: ServerNodeHolderDefinition,
    state: NodeState,
  ) {
    super(instance, definition, state);
    if (!this.instance) return;
    this.attributes = this.instance.attributes;
    this.outputs = this.instance.outputs;
    this.inputs = this.instance.inputs;
    this.inputs?.forEach((input) => (input.node = this));
    this.connected = true;
  }

  handleInput(identifier: string, data: DataHolder): any {
    if (this.connected) {
      this.instance.handleInput(identifier, data);
    } else {
      this.logger.debug(
        `Trying to input on a disconnected node [${
          this.identifier
        }] - ${identifier}: ${JSON.stringify(data)}`,
      );
    }
  }

  onAttributeChange(identifier: string, value: DataHolder) {
    if (this.connected) this.instance.onAttributeChange(identifier, value);
  }

  getNodeStateSnapshot() {
    return this.instance.getNodeStateSnapshot();
  }

  initialize() {
    this.instance.initialize();
  }

  deconstruct() {
    if (this.instance) this.instance.deconstruct();
    this.definition.deconstruct(this.identifier);
  }

  setNodeInstance(instance: NodeInstance) {
    if (!instance) return;
    this.instance = instance;
    this.connected = true;
    this.identifier = instance.identifier;
    this.instance.attributes = this.attributes;
    this.instance.outputs = this.outputs;
    this.instance.inputs = this.inputs;
    this.logger.debug(
      `Reconnecting node ${instance.identifier} - ${this.name}`,
    );
  }

  disconnect() {
    this.logger.debug(`Instance ${this.identifier} is still running ...`);
    this.connected = false;
  }

  disconnected() {
    return !this.connected;
  }
}
