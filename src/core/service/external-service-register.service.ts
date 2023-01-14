import { Injectable, Logger } from '@nestjs/common';
import { Connector } from 'src/domain/connector.interface';

@Injectable()
export class ExternalServiceRegisterService {
  private readonly logger = new Logger(ExternalServiceRegisterService.name);

  register(service: Connector) {
    this.logger.debug(`Registering external service "${service.name}".`);
  }
}
