import { Injectable, Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import {
    Headers, smarthome,
    SmartHomeV1ExecuteRequest, SmartHomeV1ExecuteResponseCommands,
    SmartHomeV1SyncDevices, SmartHomeV1SyncResponse
} from 'actions-on-google';
import { AccessTokenPayload } from "src/auth/data-types/access-token";
import { Repository } from "typeorm";
import { GoogleHomeDevice } from "./data-types/google-home.device";
import { mapDeviceForGoogleSync } from "./mapper/device-to-google.mapper";
import { GoogleDeviceEntity } from "./persistance/device.entitiy";

@Injectable()
export class HomeAssistantService {
    app: any;
    private devices: GoogleHomeDevice[]
    constructor(
        private jwtService: JwtService,
        @InjectRepository(GoogleDeviceEntity) private deviceRepo: Repository<GoogleDeviceEntity>
    ) { }

    public async init() {
        Logger.debug('Init home assistant', HomeAssistantService.name);
        this.app = smarthome();
        this.app.onSync(this.onSync.bind(this));
        this.app.onQuery(this.onQuery.bind(this));
        this.app.onExecute(this.onExecute.bind(this));
        this.app.onDisconnect(this.onDisconnect.bind(this));

        this.devices = (await this.deviceRepo.find()).map(device => new GoogleHomeDevice(device));

    }

    getDevices() {
        return this.devices;
    }

    private async getUserIdOrThrow(headers: Headers): Promise<string> {
        const authorization: string = headers.authorization as string;
        const jwtToken = authorization.replace('Bearer ', '');
        const accessTokenPayload: AccessTokenPayload = this.jwtService.verify(jwtToken)
        return accessTokenPayload.userId;
    }

    private async onSync(body, headers) {
        const userId = await this.getUserIdOrThrow(headers);

        const devices: SmartHomeV1SyncDevices[] = (await this.deviceRepo.find()).map(mapDeviceForGoogleSync)
        const syncResponse: SmartHomeV1SyncResponse = {
            requestId: body.requestId,
            payload: {
                agentUserId: userId,
                devices,
            },
        };
        return syncResponse;
    }


    private async onQuery(body, headers) {
        const userId = await this.getUserIdOrThrow(headers);
        const { devices } = body.inputs[0].payload;
        const deviceStates = []
        const queryResponse = {
            requestId: body.requestId,
            payload: {
                devices: deviceStates,
            },
        };
        return queryResponse;
    }


    private async onExecute(body: SmartHomeV1ExecuteRequest, headers) {
        const userId = await this.getUserIdOrThrow(headers);

        const response: SmartHomeV1ExecuteResponseCommands[] = []

        body.inputs.forEach(input => {
            input.payload.commands.forEach(command => {
                const affectedDeviceIds = command.devices.map(d => d.id)
                response.push({ ids: affectedDeviceIds, status: 'SUCCESS' })
                const affected = this.devices.filter(device => affectedDeviceIds.includes(device.identifier));
                command.execution.forEach(execution => {
                    affected.forEach(d => {
                        d.executeCommand(execution.command, execution.params);
                    })
                })
            })
        })

        const executeResponse = {
            requestId: body.requestId,
            payload: {
                response,
            },
        };
        return executeResponse;
    }


    private async onDisconnect(body, headers) {
        return {};

    }
}