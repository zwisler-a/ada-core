import { Module } from '@nestjs/common';
import { RetainingLogger } from './logger';

@Module({
  providers: [RetainingLogger],
  exports: [RetainingLogger],
})
export class LoggerModule {}
