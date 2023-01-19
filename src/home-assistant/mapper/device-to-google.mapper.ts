import { SmartHomeV1SyncDevices } from "actions-on-google";
import { DeviceDto } from "../data-types/device.dto";
import { GoogleDeviceEntity } from "../persistance/device.entitiy";

export function mapDeviceForGoogleSync(device: GoogleDeviceEntity): SmartHomeV1SyncDevices {
    return {
        id: device.id,
        name: {
            defaultNames: [device.name],
            name: device.name,
            nicknames: [device.name, device.id]
        },
        traits: device.traits.split(','),
        type: device.type,
        willReportState: device.willReportState,
        attributes: JSON.parse(device.attributes),
        customData: JSON.parse(device.customData),
        deviceInfo: JSON.parse(device.deviceInfo),
        otherDeviceIds: device.otherDeviceIds.split(',').map(id => ({ deviceId: id })),
        roomHint: device.roomHint
    }
}

export function mapGoogleDeviceToEntity(device: DeviceDto): GoogleDeviceEntity {
    return {
        attributes: JSON.stringify(device.attributes || {}),
        customData: JSON.stringify(device.customData || {}),
        deviceInfo: JSON.stringify(device.deviceInfo || {}),
        id: device.id,
        name: device.name.name,
        otherDeviceIds: JSON.stringify(device.otherDeviceIds || {}),
        roomHint: device.roomHint,
        traits: device.traits.join(','),
        type: device.type,
        willReportState: device.willReportState
    }
}