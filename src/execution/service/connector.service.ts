import { Injectable, Logger } from '@nestjs/common';
import { Connector } from '../interface/connector.interface';

@Injectable()
export class ConnectorService {
  private readonly logger = new Logger(ConnectorService.name);
  private connectors: Connector[] = [];

  register(con: Connector) {
    this.logger.debug(`Registering external service "${con.name}".`);
    const existing = this.connectors.find((exist) => exist.name === con.name);
    if (existing) throw new Error('Connector with same name already exists!');
    this.connectors.push(con);
  }

  updateConnector(con: Connector) {
    const existing = this.connectors.find((exist) => exist.name === con.name);
    if (existing) {
      this.connectors = this.connectors.map((existing) =>
        existing.name === con.name ? con : existing,
      );
    } else {
      this.connectors.push(con);
    }
  }

  getAll() {
    return [...this.connectors];
  }

  remove(del: Connector) {
    this.logger.debug(`Removing connector ${del.name}`);
    this.connectors = this.connectors.filter(
      (connector) => connector.name !== del.name,
    );
  }
}
