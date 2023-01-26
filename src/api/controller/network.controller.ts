import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NetworkExecutionService } from '../../execution/service/network-execution.service';
import { NetworkDto } from '../dto/network.dto';
import { NetworkPositionService } from '../service/network-position.service';
import { UnauthorizedFilter } from '../../auth/unauthorized.filter';
import { JwtAuthGuard } from '../../auth/strategies/jwt.strategy';

@ApiTags('Core')
@Controller('/core/network')
export class NetworkController {
  constructor(
    private networkService: NetworkExecutionService,
    private networkPositionService: NetworkPositionService,
  ) {}

  @UseFilters(UnauthorizedFilter)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllNetworks() {
    return this.networkPositionService.getAllNetworks();
  }

  @UseFilters(UnauthorizedFilter)
  @UseGuards(JwtAuthGuard)
  @Post()
  async saveNetwork(@Body() body: NetworkDto) {
    return this.networkPositionService.saveNetwork(body);
  }

  @UseFilters(UnauthorizedFilter)
  @UseGuards(JwtAuthGuard)
  @Delete('/:identifier')
  async deleteNetwork(@Param('identifier') id: string) {
    return this.networkPositionService.deleteNetwork(id);
  }

  @UseFilters(UnauthorizedFilter)
  @UseGuards(JwtAuthGuard)
  @Post('start/:networkId')
  async startNetwork(@Param('networkId') networkId: string) {
    return { success: await this.networkService.executeNetworkById(networkId) };
  }

  @UseFilters(UnauthorizedFilter)
  @UseGuards(JwtAuthGuard)
  @Post('stop/:networkId')
  async stopNetwork(@Param('networkId') networkId: string) {
    return { success: await this.networkService.stopNetworkById(networkId) };
  }
}
