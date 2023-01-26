import { Test } from '@nestjs/testing';
import { NetworkExecutionService } from '../service/network-execution.service';
import { NetworkRepresentation, PersistenceService } from '../../persistance';
import { NetworkMapper } from '../mapper/network.mapper';
import { AvailableNodeService } from '../service/available-node.service';

describe('NetworkExecutionService', () => {
  let testSubject: NetworkExecutionService;
  const fakeService = {
    save: jest.fn(),
    findById: jest.fn(),
    getAll: jest.fn(),
    delete: jest.fn(),
  } as unknown as PersistenceService;
  const avNodesFake = {
    getAvailableNodes: jest.fn(),
    getByIdentifier: jest.fn(),
  } as unknown as AvailableNodeService;
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        NetworkMapper,
        NetworkExecutionService,
        { provide: PersistenceService, useValue: fakeService },
        { provide: AvailableNodeService, useValue: avNodesFake },
      ],
    }).compile();

    testSubject = moduleRef.get<NetworkExecutionService>(
      NetworkExecutionService,
    );
  });

  it('should be unsuccessful on unknown network', async () => {
    const success = await testSubject.executeNetworkById('1');
    expect(success).toBeFalsy();
    expect(fakeService.findById).toBeCalledTimes(1);
    expect(fakeService.findById).toBeCalledWith('1');
  });

  it('should be successful on known network  ', async () => {
    const mockNetwork = new NetworkRepresentation();
    mockNetwork.nodes = [];
    mockNetwork.edges = [];
    fakeService.findById = jest.fn(async () => mockNetwork);
    const success = await testSubject.executeNetworkById('1');
    expect(success).toBeTruthy();
    expect(fakeService.findById).toBeCalledTimes(1);
    expect(fakeService.findById).toBeCalledWith('1');
  });

  it('should keep it in memory after executing', async () => {
    const mockNetwork = new NetworkRepresentation();
    mockNetwork.nodes = [];
    mockNetwork.edges = [];
    fakeService.findById = jest.fn(async () => mockNetwork);
    const success = await testSubject.executeNetworkById('1');
    expect(success).toBeTruthy();
    expect(testSubject.getRunning().length).toBe(1);
  });

  it('should remove stopped network', async () => {
    const mockNetwork = new NetworkRepresentation();
    mockNetwork.id = '1';
    mockNetwork.nodes = [];
    mockNetwork.edges = [];
    fakeService.findById = jest.fn(async () => mockNetwork);
    const success = await testSubject.executeNetworkById('1');
    expect(success).toBeTruthy();
    await testSubject.stopNetworkById('1');
    expect(testSubject.getRunning().length).toBe(0);
  });
});
