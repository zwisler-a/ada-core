import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AvailableNodeService } from 'src/core/service/available-node.service';
import { nodeToDto } from '../mapper/node.mapper';

@ApiTags('Core')
@Controller("/core/node")
export class NodeController {
    constructor(private availableNodesService: AvailableNodeService) { }

    @Get()
    async getAvailableNodes() {
        const nodes = await this.availableNodesService.getAvailableNodes();
        return nodes.map(nodeToDto)
    }
}
