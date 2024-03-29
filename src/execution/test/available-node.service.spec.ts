import { Test } from '@nestjs/testing';
import { AvailableNodeService } from '../service/available-node.service';
import { ConnectorService } from '../service/connector.service';
import { NodeDefinition } from '@zwisler/ada-lib';

describe('NetworkService', () => {
  let testSubject: AvailableNodeService;
  let connectorService: ConnectorService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [AvailableNodeService, ConnectorService],
    }).compile();
    testSubject = moduleRef.get<AvailableNodeService>(AvailableNodeService);
    connectorService = moduleRef.get<ConnectorService>(ConnectorService);
  });

  it('should contain nodes', async () => {
    connectorService.register({
      identifier: '',
      name: '',
      description: '',
      nodeProvider: {
        getAvailableNodes: async () => [{ identifier: '1' } as NodeDefinition],
      },
    });
    const nodes = await testSubject.getAvailableNodes();
    expect(nodes[0].identifier).toBe('1');
    expect((await testSubject.getByIdentifier('1')).identifier).toBe('1');
  });
});
