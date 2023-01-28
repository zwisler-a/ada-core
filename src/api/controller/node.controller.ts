import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AvailableNodeService } from 'src/execution/service/available-node.service';
import { NodeDtoMapper } from '../mapper/node.mapper';
import { NodeDefinitionDto } from '../dto/node-definition.dto';

@ApiTags('Core')
@Controller('core/node')
export class NodeController {
  constructor(
    private availableNodesService: AvailableNodeService,
    private nodeMapper: NodeDtoMapper,
  ) {}

  @ApiOperation({ operationId: 'get-available-nodes' })
  @ApiResponse({ type: NodeDefinitionDto, isArray: true })
  @Get('available')
  async getAvailableNodes(): Promise<NodeDefinitionDto[]> {
    const nodes = await this.availableNodesService.getAvailableNodes();
    return nodes.map((n) => this.nodeMapper.nodeDefinitionToDto(n));
  }
}
