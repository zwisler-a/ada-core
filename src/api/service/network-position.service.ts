import { Injectable } from '@nestjs/common';
import { NetworkExecutionService } from '../../execution';
import { NetworkDtoMapper } from '../mapper/network.mapper';
import { PositionService } from '../../graphic/position.service';
import { NetworkDto } from '../dto/network.dto';
import { Position } from '../../graphic/position.interface';
import { PersistenceService } from '../../persistance';

@Injectable()
export class NetworkPositionService {
  constructor(
    private persistenceService: PersistenceService,
    private networkExecutionService: NetworkExecutionService,
    private networkDtoMapper: NetworkDtoMapper,
    private positionService: PositionService,
  ) {}

  async getAllNetworks() {
    const networks = await this.persistenceService.getAll();
    const runningNetworkIds = this.networkExecutionService.getRunning();
    const networksAndPositions = await Promise.all(
      networks.map(async (network) => ({
        network,
        positions: await this.positionService.findPositionsFor(
          network.nodes.map((n) => n.id),
        ),
      })),
    );
    return Promise.all(
      networksAndPositions.map((networkAndPosition) =>
        this.networkDtoMapper.networkToDto(
          {
            ...networkAndPosition.network,
            active: runningNetworkIds.includes(networkAndPosition.network.id),
          },
          networkAndPosition.positions,
        ),
      ),
    );
  }

  async saveNetwork(dto: NetworkDto): Promise<NetworkDto> {
    const positions = dto.nodes.map(
      (node) =>
        ({
          identifier: node.identifier,
          x: node.x,
          y: node.y,
        } as Position),
    );
    const savedPositions = await this.positionService.savePositions(positions);

    const network = await this.networkDtoMapper.dtoToNetwork(dto);
    const savedNetwork = await this.persistenceService.save(network);
    return this.networkDtoMapper.networkToDto(savedNetwork, savedPositions);
  }

  async deleteNetwork(id: string) {
    const networkStopped = await this.networkExecutionService.stopNetworkById(
      id,
    );
    if (networkStopped) {
      await this.persistenceService.delete(id);
      return { success: true };
    }
    return { success: false };
  }
}
