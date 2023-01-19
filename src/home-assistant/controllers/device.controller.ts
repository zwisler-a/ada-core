import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtAuthGuard } from 'src/auth/strategies/jwt.strategy';
import { Repository } from 'typeorm';
import { DeviceDto } from '../data-types/device.dto';
import { mapDeviceForGoogleSync, mapGoogleDeviceToEntity } from '../mapper/device-to-google.mapper';
import { GoogleDeviceEntity } from '../persistance/device.entitiy';

@Controller("/assistent/device")
export class HomeAssistantDeviceController {
    constructor(@InjectRepository(GoogleDeviceEntity) private deviceRepo: Repository<GoogleDeviceEntity>) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    authorize(@Body() device: DeviceDto) {
        return this.deviceRepo.save(mapGoogleDeviceToEntity(device));
    }
}
