import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoreModule } from 'src/core/core.module';
import { ConnectorService } from 'src/core/service/connector.service';
import { GoogleHomeDeviceController } from './controllers/device.controller';
import { GoogleHomeFulfillmentController } from './controllers/fulfillment.controller';
import { GoogleHomeDeviceService } from './device.service';
import { GoogleHomeFulfillmentService } from './fulfillment.service';
import { GoogleDeviceEntity } from './persistance/device.entitiy';


@Module({
    imports: [
        CoreModule,
        HttpModule,
        JwtModule.register({ secret: process.env.JWT_SECRET }),
        TypeOrmModule.forFeature([GoogleDeviceEntity])
    ],
    controllers: [GoogleHomeFulfillmentController, GoogleHomeDeviceController],
    providers: [GoogleHomeFulfillmentService, GoogleHomeDeviceService],
})
export class HomeAssistentModule {
    constructor(
        private homeAssistantService: GoogleHomeFulfillmentService,
        private registerService: ConnectorService,
        private deviceService: GoogleHomeDeviceService
    ) {
        this.initalize();
    }

    private async initalize() {
        await this.homeAssistantService.init();
        this.registerService.register({
            name: 'Google Home',
            description: 'Google Smart Home Connector',
            deviceProvider: this.deviceService
        })
    }

}
