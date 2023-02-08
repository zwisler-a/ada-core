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

  updateConnector(con: Partial<Connector>) {
    const existing = this.connectors.find(
      (exist) => exist.identifier === con.identifier,
    );
    if (existing) {
      this.connectors = this.connectors.map((existing) =>
        existing.identifier === con.identifier
          ? Object.assign({}, existing, con)
          : existing,
      );
    }
  }

  getAll() {
    return [...this.connectors];
  }

  remove(connectorId: string) {
    this.logger.debug(`Removing connector ${connectorId}`);
    this.connectors = this.connectors.filter(
      (connector) => connector.identifier !== connectorId,
    );
  }
}
