import { InstanceManagerService } from '../instance-manager.service';
import { Subject } from 'rxjs';
import {
  CreateInstanceEvent,
  DestroyInstanceEvent,
  InputEvent,
  IOEventType,
} from '../../events';
import { RemoteApiService } from '../remote-api.service';
import { Deconstruct, Input, Node, ProxyHelper } from '../../proxy';

const wait = (time = 100) => new Promise((res) => setTimeout(res, time));
describe('Instance Manager', () => {
  let instantiation$ = new Subject();
  let instance$ = new Subject();
  let api: RemoteApiService;
  let manager: InstanceManagerService;

  beforeEach(() => {
    instantiation$ = new Subject();
    instance$ = new Subject();
    api = {
      createInstantiationObservable: jest.fn(() => instantiation$),
      createInstanceObservable: jest.fn(() => instance$),
      updateOutput: jest.fn(),
      updateAttribute: jest.fn(),
    } as any;
    manager = new InstanceManagerService({ log: console.log }, api);
  });

  it('should create an instance', () => {
    @Node({ name: '1', identifier: '1' })
    class TestNodeDef {
      constructor(def, private spy) {
        spy();
      }
    }

    const spy = jest.fn();
    manager.watchForInstantiation('1', ProxyHelper.create(TestNodeDef, spy));
    const instantiationEvent: CreateInstanceEvent = {
      type: IOEventType.CREATE,
      state: {},
      nodeInstanceIdentifier: '123',
      connectorIdentifier: '1',
      definitionIdentifier: '1',
    };
    instantiation$.next(instantiationEvent);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should receive input', async () => {
    @Node({ name: '1', identifier: '1' })
    class TestNodeDef2 {
      constructor(def, private spy) {}

      @Input({ name: '1', identifier: 'input' })
      input(data) {
        this.spy(data);
      }
    }

    const spy = jest.fn();
    console.log(TestNodeDef2)
    manager.watchForInstantiation('1', ProxyHelper.create(TestNodeDef2, spy));
    const instantiationEvent: CreateInstanceEvent = {
      type: IOEventType.CREATE,
      state: {},
      nodeInstanceIdentifier: '123',
      connectorIdentifier: '1',
      definitionIdentifier: '1',
    };
    instantiation$.next(instantiationEvent);
    const inputEvent: InputEvent = {
      type: IOEventType.INPUT,
      connectorIdentifier: '1',
      nodeInstanceIdentifier: '123',
      inputIdentifier: 'input',
      value: '"test"',
    };
    await wait();
    instance$.next(inputEvent);
    await wait();
    expect(api.createInstanceObservable).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledTimes(1);
  }, 1000);

  it('should not receive input after deconstruct', async () => {
    @Node({ name: '1', identifier: '1' })
    class TestNodeDef3 {
      constructor(def, private inputSpy, private deconstructSpy) {}

      @Input({ name: '', identifier: 'input' })
      input(data) {
        this.inputSpy(data);
      }

      @Deconstruct()
      deconstruct() {
        this.deconstructSpy();
      }
    }

    const spy = jest.fn();
    const dspy = jest.fn();
    manager.watchForInstantiation(
      '1',
      ProxyHelper.create(TestNodeDef3, spy, dspy),
    );
    const instantiationEvent: CreateInstanceEvent = {
      type: IOEventType.CREATE,
      state: {},
      nodeInstanceIdentifier: '123',
      connectorIdentifier: '1',
      definitionIdentifier: '1',
    };
    instantiation$.next(instantiationEvent);
    const inputEvent: InputEvent = {
      type: IOEventType.INPUT,
      connectorIdentifier: '1',
      nodeInstanceIdentifier: '123',
      inputIdentifier: 'input',
      value: '"test"',
    };
    await wait();
    instance$.next(inputEvent);
    const deconstructEvent: DestroyInstanceEvent = {
      type: IOEventType.DESTROY,
      connectorIdentifier: '1',
      nodeInstanceIdentifier: '123',
    };
    await wait();
    instance$.next(inputEvent);
    await wait();
    instance$.next(deconstructEvent);
    await wait();
    instance$.next(inputEvent);
    expect(api.createInstanceObservable).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(dspy).toHaveBeenCalledTimes(1);
    await wait();
    instantiation$.next(instantiationEvent);
    await wait();
    instance$.next(inputEvent);
    await wait();
    expect(api.createInstanceObservable).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledTimes(3);
  });
});
