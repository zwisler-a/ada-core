import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoreModule } from 'src/core/core.module';
import { ConnectionEntity } from './entities/connection.entity';
import { NetworkEntity } from './entities/network.entity';
import { NodeEntity } from './entities/node.entity';
import { ConnectionMapper } from './mapper/connection-mapper.service';
import { NetworkMapper } from './mapper/network-mapper.service';
import { NodeMapper } from './mapper/node-mapper.service';
import { NetworkService } from './service/network.service';

@Module({
  imports: [
    CoreModule,
    TypeOrmModule.forFeature([NetworkEntity, NodeEntity, ConnectionEntity]),
  ],
  controllers: [],
  providers: [NetworkService, NodeMapper, ConnectionMapper, NetworkMapper],
  exports: [],
})
export class PersistenceModule {}
