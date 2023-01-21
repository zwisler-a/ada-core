import { Test } from '@nestjs/testing';
import { NetworkRepository } from '../persistence/repository/network-repository.service';
import { NetworkService } from '../service/network.service';
import { Network } from '../../domain/node/network';

describe('NetworkService', () => {
  let testSubject: NetworkService;
  const fakeService = {
    save: jest.fn(),
    findBy: jest.fn(),
    find: jest.fn(),
    deleteBy: jest.fn(),
  };
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        NetworkService,
        { provide: NetworkRepository, useValue: fakeService },
      ],
    }).compile();

    testSubject = moduleRef.get<NetworkService>(NetworkService);
  });

  it('should be created', async () => {
    expect(testSubject).toBeTruthy();
  });
  it('should fetch all from repo', async () => {
    testSubject.getAll();
    expect(fakeService.find).toHaveBeenCalledTimes(1);
  });
  it('should delete in repo', async () => {
    testSubject.delete('1');
    expect(fakeService.deleteBy).toHaveBeenCalledTimes(1);
  });
  it('should stop network', async () => {
    const res = await testSubject.stopNetworkById('1');
    expect(res).toBe(false);
  });
  it('should start network', async () => {
    const res = await testSubject.executeNetworkById('1');
    expect(res).toBe(false);
  });
  it('should get the network from repo', async () => {
    const network = new Network([], []);
    fakeService.findBy = jest.fn(() => network);
    const res = await testSubject.executeNetworkById('1');
    expect(fakeService.findBy).toHaveBeenCalledTimes(1);
  });
  it('should get the network from loaded', async () => {
    const network = new Network([], []);
    network.identifier = '1';
    fakeService.findBy = jest.fn(() => network);
    await testSubject.executeNetworkById('1');
    await testSubject.executeNetworkById('1');
    expect(fakeService.findBy).toHaveBeenCalledTimes(1);
  });
  it('should get the network from loaded', async () => {
    const network = new Network([], []);
    network.identifier = '1';
    fakeService.findBy = jest.fn(() => network);
    await testSubject.executeNetworkById('1');
    await testSubject.delete('1');
    await testSubject.executeNetworkById('1');
    expect(fakeService.findBy).toHaveBeenCalledTimes(2);
  });
  it('should get stop the network', async () => {
    const network = new Network([], []);
    network.identifier = '1';
    fakeService.findBy = jest.fn(() => network);
    await testSubject.executeNetworkById('1');
    await testSubject.stopNetworkById('1');
    expect(testSubject.getRunning().length).toBe(1);
  });
});
