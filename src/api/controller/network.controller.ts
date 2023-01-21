import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NetworkService } from '../../core/service/network.service';
import { NetworkDtoMapper } from '../mapper/network.mapper';
import { NetworkDto } from '../dto/network.dto';

@ApiTags('Core')
@Controller('/core/network')
export class NetworkController {
  constructor(
    private networkService: NetworkService,
    private networkDtoMapper: NetworkDtoMapper,
  ) {}

  @Get()
  async getAllNetworks() {
    const networks = await this.networkService.getAll();
    return networks.map((network) =>
      this.networkDtoMapper.networkToDto(network),
    );
  }

  @Post()
  async saveNetwork(@Body() body: NetworkDto) {
    const network = await this.networkDtoMapper.dtoToNetwork(body);
    const saved = this.networkDtoMapper.networkToDto(
      await this.networkService.save(network),
    );
    return saved;
  }

  @Delete('/:identifier')
  async deleteNetwork(@Param('identifier') id: string) {
    await this.networkService.delete(id);
  }

  @Post('running')
  async getRunningNetworks() {
    return this.networkService
      .getRunning()
      .map((network) => this.networkDtoMapper.networkToDto(network));
  }

  @Post('start/:networkId')
  async startNetwork(@Param('networkId') networkId: string) {
    return this.networkService.executeNetworkById(networkId);
  }

  @Post('stop/:networkId')
  async stopNetwork(@Param('networkId') networkId: string) {
    return this.networkService.stopNetworkById(networkId);
  }
}
