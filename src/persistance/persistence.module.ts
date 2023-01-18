import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConnectionEntity } from './entities/connection.entity';
import { NetworkEntity } from './entities/network.entity';
import { NodeEntity } from './entities/node.entity';
import { ConnectionMapper } from './mapper/connection-mapper.service';
import { NetworkMapper } from './mapper/network-mapper.service';
import { NodeMapper } from './mapper/node-mapper.service';
import { NetworkService } from './service/network.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      // TODO Env
      type: 'mysql',
      host: 'localhost',
      port: 3307,
      username: 'root',
      password: 'password',
      database: 'db',
      entities: [NetworkEntity, NodeEntity, ConnectionEntity],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([NetworkEntity, NodeEntity, ConnectionEntity]),
  ],
  controllers: [],
  providers: [NetworkService, NodeMapper, ConnectionMapper, NetworkMapper],
  exports: [],
})
export class PersistenceModule {}
