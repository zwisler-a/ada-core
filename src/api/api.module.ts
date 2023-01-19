import { Module } from '@nestjs/common';
import { CoreModule } from 'src/core/core.module';
import { ConnectionController } from './controller/connection.controller';
import { NetworkController } from './controller/network.controller';
import { NodeController } from './controller/node.controller';

@Module({
  imports: [CoreModule],
  controllers: [NodeController, ConnectionController, NetworkController],
  providers: [],
  exports: [],
})
export class ApiModule { }
