import { Test } from '@nestjs/testing';
import { NetworkRepository } from '../../repository/network-repository.service';
import { NetworkMapperService } from '../../mapper/network-mapper.service';
import { NodeMapperService } from '../../mapper/node-mapper.service';
import { EdgeMapperService } from '../../mapper/edge-mapper.service';
import { NodeAttributeMapperService } from '../../mapper/node-attribute-mapper.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NetworkEntity } from '../../entitiy/network.entity';
import { AvailableNodeService } from '../../../service/available-node.service';
import { Network } from '../../../../domain/node/network';

describe('NetworkRepository', () => {
  let testSubject: NetworkRepository;
  const fakeRepo = {
    save: jest.fn(async () => new Network([], [])),
    findOneBy: jest.fn(() => new Network([], [])),
    find: jest.fn(() => [new Network([], [])]),
    delete: jest.fn(),
  };
  const fakeAvService = {
    getAvailableNodes: jest.fn(() => []),
  };
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        { provide: getRepositoryToken(NetworkEntity), useValue: fakeRepo },
        { provide: AvailableNodeService, useValue: fakeAvService },
        NetworkRepository,
        NetworkMapperService,
        NodeMapperService,
        EdgeMapperService,
        NodeAttributeMapperService,
      ],
    }).compile();

    testSubject = moduleRef.get<NetworkRepository>(NetworkRepository);
  });

  it('should return an array of cats', async () => {
    expect(testSubject).toBeTruthy();
  });
  it('should save', () => {
    testSubject.save(new Network([], []));
    expect(fakeRepo.save).toHaveBeenCalledTimes(1);
  });
  it('should delete', async () => {
    await testSubject.deleteBy('123');
    expect(fakeRepo.delete).toHaveBeenCalledTimes(1);
  });
  it('should find', () => {
    testSubject.find();
    expect(fakeRepo.find).toHaveBeenCalledTimes(1);
  });
  it('should findBy', () => {
    testSubject.findBy('123');
    expect(fakeRepo.findOneBy).toHaveBeenCalledTimes(1);
  });
});
