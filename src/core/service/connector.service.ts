import { Injectable, Logger } from '@nestjs/common';
import { Connector } from '../interface/connector.interface';

@Injectable()
export class ConnectorService {
  private readonly logger = new Logger(ConnectorService.name);
  private connectors: Connector[] = [];


  register(con: Connector) {
    this.logger.debug(`Registering external service "${con.name}".`);
    this.connectors.push(con)
  }

  getAll() {
    return [...this.connectors]
  }
}
