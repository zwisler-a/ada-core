import { Injectable, Logger } from '@nestjs/common';
import { NodeEntity } from '../entitiy/node.entitiy';
import { NodeInstance } from '../../../domain/node/instance/node-instance';
import { AvailableNodeService } from '../../service/available-node.service';
import { NodeAttributeMapperService } from './node-attribute-mapper.service';

@Injectable()
export class NodeMapperService {
  private logger: Logger = new Logger(NodeMapperService.name);

  constructor(
    private availableNodeService: AvailableNodeService,
    private attributeMapper: NodeAttributeMapperService,
  ) {}

  async entityToNode(entity: NodeEntity): Promise<NodeInstance> {
    const nodeDefinition = await this.availableNodeService.getByIdentifier(
      entity.definitionId,
    );
    if (!nodeDefinition) {
      this.logger.error('Could not find node definition with id ' + entity.id);
      return null;
    }
    const nodeInstance = await nodeDefinition.createInstance();
    nodeInstance.attributes =
      entity.attributes?.map((attr) => {
        const attribute = this.attributeMapper.entityToAttribute(
          attr,
          nodeInstance,
        );
        return attribute;
      }) ?? nodeInstance.attributes;
    nodeInstance.name = entity.name;
    nodeInstance.identifier = entity.id;
    nodeInstance.description = entity.description;
    return nodeInstance;
  }

  nodeToEntity(node: NodeInstance): NodeEntity {
    const entity = new NodeEntity();
    entity.id = node.identifier;
    entity.name = node.name;
    entity.description = node.description;
    entity.definitionId = node.definition.identifier;
    entity.attributes =
      node.definition.attributes.map((attr) =>
        this.attributeMapper.attributeToEntity(attr, node),
      ) ?? [];
    return entity;
  }
}
