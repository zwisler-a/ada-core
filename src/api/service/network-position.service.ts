import { Delete, Injectable, Param, Post } from '@nestjs/common';
import { NetworkService } from '../../core/service/network.service';
import { NetworkDtoMapper } from '../mapper/network.mapper';
import { PositionService } from '../../graphic/position.service';
import { NetworkDto } from '../dto/network.dto';
import { Position } from '../../graphic/position.interface';

@Injectable()
export class NetworkPositionService {
  constructor(
    private networkService: NetworkService,
    private networkDtoMapper: NetworkDtoMapper,
    private positionService: PositionService,
  ) {}

  async getAllNetworks() {
    const networks = await this.networkService.getAll();
    const networksAndPositions = await Promise.all(
      networks.map(async (network) => ({
        network,
        positions: await this.positionService.findPositionsFor(
          network.nodes.map((n) => n.identifier),
        ),
      })),
    );
    return networksAndPositions.map((networkAndPosition) =>
      this.networkDtoMapper.networkToDto(
        networkAndPosition.network,
        networkAndPosition.positions,
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
    const savedNetwork = await this.networkService.save(network);
    return this.networkDtoMapper.networkToDto(savedNetwork, savedPositions);
  }

  async deleteNetwork(id: string) {
    const network = await this.networkService.findOne(id);
    await this.positionService.delete(
      network.nodes.map((node) => node.identifier),
    );
    await this.networkService.delete(id);
    return { success: true };
  }
}
