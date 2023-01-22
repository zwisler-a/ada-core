import { TypeOrmModule } from '@nestjs/typeorm';
import { PositionService } from './position.service';
import { PositionEntity } from './position.entity';
import { Module } from '@nestjs/common';
import { PositionMapperService } from './position-mapper.service';

@Module({
  imports: [TypeOrmModule.forFeature([PositionEntity])],
  controllers: [],
  providers: [PositionService, PositionMapperService],
  exports: [PositionService],
})
export class GraphicModule {}
