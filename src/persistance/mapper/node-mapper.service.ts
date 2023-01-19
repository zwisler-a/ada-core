import { Injectable } from "@nestjs/common";
import { AvailableDeviceService } from "src/core/service/available-device.service";
import { MapperNode } from "../../core/core-nodes/mapper-node";
import { Device } from "../../domain/devices/device";
import { Node } from "../../domain/engine/node";
import { DeviceNode } from "../../domain/engine/nodes/device-node";
import { DeviceNodeEntity, MapperNodeEntity, NodeEntity } from "../entities/node.entity";

@Injectable()
export class NodeMapper {

    constructor(private availableNodeService: AvailableDeviceService) { }

    async mapNodeEntityToNode(entity: NodeEntity): Promise<Node> {

        if (entity instanceof MapperNodeEntity) {
            const node = new MapperNode<any, any>(new Function('object', 'return (' + entity.mapperFunc + ')(object)') as any); // TODO
            this.mapNodeEntityBaseToNodeBase(entity, node)
            return node;
        }

        if (entity instanceof DeviceNodeEntity) {
            const device = await this.availableNodeService.findByIdentifier(entity.deviceIdentifier);
            let node: DeviceNode;
            if (device) {
                node = new DeviceNode(device);
            } else {
                const unsyncedDevice = new Device();
                unsyncedDevice.identifier = entity.deviceIdentifier;
                unsyncedDevice.synced = false;
                node = new DeviceNode(unsyncedDevice);
            }
            this.mapNodeEntityBaseToNodeBase(entity, node)
            return node;
        }


        throw new Error(`Could not map node ${JSON.stringify(entity)}`)

    }

    mapNodeToNodeEntity(node: Node): NodeEntity {
        if (node instanceof MapperNode) {
            const entity = new MapperNodeEntity;
            entity.mapperFunc = node.mapperMethod.toString();
            this.mapNodeBaseToNodeEntityBase(entity, node)
            return entity;
        }

        if (node instanceof DeviceNode) {
            const entity = new DeviceNodeEntity();
            entity.deviceIdentifier = node.getDevice().identifier;
            this.mapNodeBaseToNodeEntityBase(entity, node)
            return entity;
        }


        throw new Error(`Could not map node ${JSON.stringify(node)}`)
    }

    private mapNodeEntityBaseToNodeBase(entity: NodeEntity, node: Node) {
        node.identifier = entity.id;
        node.name = entity.name;
        node.description = entity.description;
    }

    private mapNodeBaseToNodeEntityBase(entity: NodeEntity, node: Node) {
        entity.id = node.identifier;
        entity.name = node.name;
        entity.description = node.description;
    }
}

