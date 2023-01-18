import { Injectable, Logger } from '@nestjs/common';
import { Connector } from './connector.interface';


@Injectable()
export class ExternalServiceService {
  private readonly logger = new Logger(ExternalServiceService.name);
  private services: Connector[] = [];

  add(service: Connector) {
    this.services.push(service);
  }

  getAll() {
    return [...this.services];
  }
}
