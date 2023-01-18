import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MapperNode } from '../core/core-nodes/mapper-node';
import { AvailableDeviceService } from '../core/service/available-device.service';
import { Connection } from '../domain/engine/connection';
import { Network } from '../domain/engine/network';
import { NetworkEntity } from './entities/network.entity';
import { ConnectionMapper } from './mapper/connection-mapper.service';
import { NetworkMapper } from './mapper/network-mapper.service';
import { NodeMapper } from './mapper/node-mapper.service';
import { NetworkService } from './service/network.service';

describe('Persistence NetworkService', () => {
  let testSubject: NetworkService;

  const mockedRepo = {
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NetworkService,
        NetworkMapper,
        NodeMapper,
        ConnectionMapper,
        {
          provide: getRepositoryToken(NetworkEntity),
          useValue: mockedRepo,
        },
        {
          provide: AvailableDeviceService,
          useValue: jest.fn(),
        },
      ],
    }).compile();
    testSubject = await module.get(NetworkService);
  });

  it('should save a network', () => {
    const nodes = [new MapperNode((a) => a), new MapperNode((a) => a)];
    const connections = [
      new Connection(
        null,
        nodes[0].getDefaultOutput(),
        nodes[1].getDefaultInput(),
        nodes[0],
        nodes[1],
      ),
    ];
    const network = new Network(null, 'test', 'test desc', nodes, connections);
    testSubject.saveNetwork(network);
    expect(mockedRepo.save).toHaveBeenCalledTimes(1);
  });
});
