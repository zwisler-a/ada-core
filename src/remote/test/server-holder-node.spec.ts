import {
  DataHolder,
  Identifiable,
  NodeAttributeDefinition,
  NodeDefinition,
  NodeInputDefinition,
  NodeInstance,
  NodeOutputDefinition,
  NodeState,
} from '@zwisler/ada-lib';
import { ServerNodeHolderDefinition } from '../node/server-node-holder-definition';
import { ServerNodeHolderInstance } from '../node/server-node-holder-instance';

class TestNodeDef extends NodeDefinition {
  attributes: NodeAttributeDefinition[] = [
    NodeAttributeDefinition.from('1', '1', '1'),
  ];
  inputs: NodeInputDefinition[] = [NodeInputDefinition.from('1', '1', '1')];
  outputs: NodeOutputDefinition[] = [NodeOutputDefinition.from('1', '1', '1')];

  constructor() {
    super(Identifiable.create(''));
  }

  async createInstance(state: NodeState, id): Promise<NodeInstance> {
    return new TestNodeInstance(id, this, state);
  }
}

class TestNodeInstance extends NodeInstance {
  getNodeStateSnapshot() {
    return {};
  }

  handleInput(identifier: string, data: DataHolder) {
    //
  }
}

describe('ServerNodeHolder', () => {
  it('should have the actual definitions specification', function () {
    const def = new TestNodeDef();
    const holder = new ServerNodeHolderDefinition(def);
    expect(holder.outputs).toBe(def.outputs);
    expect(holder.inputs).toBe(def.inputs);
    expect(holder.attributes).toBe(def.attributes);
  });

  it('should create a holder instance', async function () {
    const def = new TestNodeDef();
    const holder = new ServerNodeHolderDefinition(def);
    const instance = await holder.createInstance(
      NodeState.from({}),
      Identifiable.create(''),
    );
    expect(instance instanceof ServerNodeHolderInstance).toBe(true);
  });

  it('should pass the input to the actual instance', async function () {
    const def = new TestNodeDef();
    const inst: NodeInstance = {
      inputs: [],
      handleInput: jest.fn(),
    } as any;

    def.createInstance = async () => inst;
    const holder = new ServerNodeHolderDefinition(def);
    const instance = await holder.createInstance(
      NodeState.from({}),
      Identifiable.create(''),
    );
    instance.handleInput('id', { data: '1' });
    expect(inst.handleInput).toHaveBeenCalledTimes(1);
    expect(inst.handleInput).toHaveBeenCalledWith('id', { data: '1' });
  });

  it('should pass the output from the actual instance', async function () {
    const def = new TestNodeDef();
    const inst: NodeInstance = new TestNodeInstance(
      Identifiable.create(''),
      def,
      new NodeState(null),
    );
    def.createInstance = async () => inst;

    const holder = new ServerNodeHolderDefinition(def);
    const instance = await holder.createInstance(
      NodeState.from({}),
      Identifiable.create(''),
    );
    const spy = jest.fn();
    instance.outputs[0].subscribe(spy);
    inst.updateOutput('1', { data: '1' });
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({ data: '1' });
  });

  it('should not pass the input if disconnected', async function () {
    const def = new TestNodeDef();
    const inst: NodeInstance = {
      handleInput: jest.fn(),
    } as any;

    def.createInstance = async () => inst;
    const holder = new ServerNodeHolderDefinition(def);
    const instance = await holder.createInstance(
      NodeState.from({}),
      Identifiable.create(''),
    );
    instance.disconnect();
    instance.handleInput('id', { data: '1' });
    expect(inst.handleInput).toHaveBeenCalledTimes(0);
  });

  it('should not pass the input if reconnected', async function () {
    const def = new TestNodeDef();
    const inst: NodeInstance = {
      handleInput: jest.fn(),
    } as any;

    def.createInstance = async () => inst;
    const holder = new ServerNodeHolderDefinition(def);
    const instance = await holder.createInstance(
      NodeState.from({}),
      Identifiable.create(''),
    );
    instance.disconnect();
    instance.handleInput('id', { data: '1' });
    instance.setNodeInstance(inst);
    instance.handleInput('id', { data: '1' });
    expect(inst.handleInput).toHaveBeenCalledTimes(1);
    expect(inst.handleInput).toHaveBeenCalledWith('id', { data: '1' });
  });

  it('should not reconnect on definition level', async function () {
    const def = new TestNodeDef();
    const inst: NodeInstance = {
      identifier: '123',
      handleInput: jest.fn(),
      getNodeStateSnapshot: jest.fn(),
    } as any;

    def.createInstance = async () => inst;
    const holder = new ServerNodeHolderDefinition(def);
    const instance = await holder.createInstance(
      NodeState.from({}),
      Identifiable.create(''),
    );
    holder.disconnect();
    instance.handleInput('id', { data: '1' });
    await holder.reconnect();
    instance.handleInput('id', { data: '1' });
    expect(inst.handleInput).toHaveBeenCalledTimes(1);
    expect(inst.handleInput).toHaveBeenCalledWith('id', { data: '1' });
  });
});
