import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NetworkService } from '../../core/service/network.service';
import { NetworkDto } from '../dto/network.dto';
import { NetworkPositionService } from '../service/network-position.service';

@ApiTags('Core')
@Controller('/core/network')
export class NetworkController {
  constructor(
    private networkService: NetworkService,
    private networkPositionService: NetworkPositionService,
  ) {}

  @Get()
  async getAllNetworks() {
    return this.networkPositionService.getAllNetworks();
  }

  @Post()
  async saveNetwork(@Body() body: NetworkDto) {
    return this.networkPositionService.saveNetwork(body);
  }

  @Delete('/:identifier')
  async deleteNetwork(@Param('identifier') id: string) {
    return this.networkPositionService.deleteNetwork(id);
  }

  @Post('start/:networkId')
  async startNetwork(@Param('networkId') networkId: string) {
    return { success: await this.networkService.executeNetworkById(networkId) };
  }

  @Post('stop/:networkId')
  async stopNetwork(@Param('networkId') networkId: string) {
    return { success: await this.networkService.stopNetworkById(networkId) };
  }
}
