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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NetworkExecutionService } from '../../execution';
import { NetworkDto } from '../dto/network.dto';
import { NetworkPositionService } from '../service/network-position.service';
import { UnauthorizedFilter } from '../unauthorized.filter';
import { JwtAuthGuard } from '../jwt.strategy';

@ApiTags('Core')
@Controller('/core/network')
export class NetworkController {
  constructor(
    private networkService: NetworkExecutionService,
    private networkPositionService: NetworkPositionService,
  ) {}

  @UseFilters(UnauthorizedFilter)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    operationId: 'get-all-networks',
  })
  @ApiResponse({ isArray: true, type: NetworkDto })
  @Get()
  async getAllNetworks() {
    return this.networkPositionService.getAllNetworks();
  }

  @UseFilters(UnauthorizedFilter)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    operationId: 'get-network',
  })
  @ApiResponse({ type: NetworkDto })
  @Get(':id')
  async getNetwork(@Param('id') id: string) {
    return this.networkPositionService.get(id);
  }

  @UseFilters(UnauthorizedFilter)
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ operationId: 'save-network' })
  async saveNetwork(@Body() body: NetworkDto) {
    return this.networkPositionService.saveNetwork(body);
  }

  @UseFilters(UnauthorizedFilter)
  @UseGuards(JwtAuthGuard)
  @Delete('/:identifier')
  @ApiOperation({ operationId: 'delete-network' })
  async deleteNetwork(@Param('identifier') id: string) {
    return this.networkPositionService.deleteNetwork(id);
  }

  @UseFilters(UnauthorizedFilter)
  @UseGuards(JwtAuthGuard)
  @Post('start/:networkId')
  @ApiOperation({ operationId: 'start-network' })
  async startNetwork(@Param('networkId') networkId: string) {
    return { success: await this.networkService.executeNetworkById(networkId) };
  }

  @UseFilters(UnauthorizedFilter)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ operationId: 'stop-network' })
  @Post('stop/:networkId')
  async stopNetwork(@Param('networkId') networkId: string) {
    return { success: await this.networkService.stopNetworkById(networkId) };
  }
}
