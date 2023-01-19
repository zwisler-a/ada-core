import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoreModule } from 'src/core/core.module';
import { ExternalServiceRegisterService } from 'src/core/service/external-service-register.service';
import { HomeAssistantDeviceController } from './controllers/device.controller';
import { HomeAssistantFulfillmentController } from './controllers/home-assistant.controller';
import { HomeAssistantService } from './home-assistant.service';
import { GoogleDeviceEntity } from './persistance/device.entitiy';


@Module({
    imports: [
        CoreModule,
        HttpModule,
        JwtModule.register({ secret: process.env.JWT_SECRET }),
        TypeOrmModule.forFeature([GoogleDeviceEntity])
    ],
    controllers: [HomeAssistantFulfillmentController, HomeAssistantDeviceController],
    providers: [HomeAssistantService,],
})
export class HomeAssistentModule {
    constructor(
        private homeAssistantService: HomeAssistantService,
        private registerService: ExternalServiceRegisterService
    ) {
        this.initalize();
    }

    private async initalize() {
        await this.homeAssistantService.init();
        this.registerService.register({
            name: 'Google Home',
            description: 'Google Smart Home Connector',
            deviceProvider: { getAvailableDevices: () => this.homeAssistantService.getDevices() }
        })
    }

}
