import { Injectable, Logger } from '@nestjs/common';
import { Node } from 'src/domain/engine/node';
import { DeviceNode } from 'src/domain/engine/nodes/device-node';
import { AvailableDeviceService } from './available-device.service';
import { ConnectorService } from './connector.service';

@Injectable()
export class AvailableNodeService {

    private readonly logger = new Logger(AvailableNodeService.name);

    constructor(
        private externalServiceService: ConnectorService,
        private availableDeviceService: AvailableDeviceService
    ) { }

    getProvidedNodes(): Promise<Node[]> {
        return Promise.all(
            this.externalServiceService
                .getAll()
                .filter(service => !!service.nodeProvider)
                .map((service) => service.nodeProvider.getAvailableNodes())
        ).then(arr => arr.flatMap(device => device));
    }

    async getDeviceNodes(): Promise<Node[]> {
        const devices = await this.availableDeviceService.getAvailableDevices();
        return devices.map(device => new DeviceNode(device));
    }

    async getAvailableNodes() {
        const provided = this.getProvidedNodes();
        const devices = this.getDeviceNodes();
        return [...await provided, ...await devices]
    }

    async findByIdentifier(deviceIdentifier: string) {
        return (await this.getProvidedNodes()).find(device => device.identifier === deviceIdentifier);
    }
}
