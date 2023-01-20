import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtAuthGuard } from 'src/auth/strategies/jwt.strategy';
import { Repository } from 'typeorm';
import { GoogleDeviceDto } from '../data-types/google-device.dto';
import { GoogleHomeDeviceService } from '../device.service';
import {
  mapEntityToGoogleDevice,
  mapGoogleDeviceToEntity,
} from '../mapper/device-to-google.mapper';
import { GoogleDeviceEntity } from '../persistance/device.entitiy';

@ApiTags('Google Home')
@Controller('/assistant/device')
export class GoogleHomeDeviceController {
  constructor(private deviceService: GoogleHomeDeviceService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  createGoogleDevice(@Body() device: GoogleDeviceDto) {
    this.deviceService.createDevice(device);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getGoogleDevices(): Promise<GoogleDeviceDto[]> {
    return this.deviceService.getDevices();
  }
}
