import { Injectable, Logger } from '@nestjs/common';
import { RemoteConnectorNodeManagerService } from './remote-connector-node-manager.service';

@Injectable()
export class ConnectorHealthService {
  private logger = new Logger(ConnectorHealthService.name);
  private observedConnectors: { [key: string]: any } = {};

  constructor(private nodeManager: RemoteConnectorNodeManagerService) {}

  healthPing(connectorId: string) {
    let debounceFn = this.observedConnectors[connectorId];
    if (!debounceFn) {
      debounceFn = this.debounce(
        this.timeoutConnector.bind(this, connectorId),
        10000,
      );
      this.observedConnectors[connectorId] = debounceFn;
      this.logger.debug(`Observing new Connector ${connectorId}`);
    }
    debounceFn();
  }

  private timeoutConnector(connectorId: string) {
    this.nodeManager.timeoutConnector(connectorId);
  }

  private debounce<F extends (...args: Parameters<F>) => ReturnType<F>>(
    fn: F,
    delay: number,
  ) {
    let timeout: ReturnType<typeof setTimeout>;
    return function (...args: Parameters<F>) {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        fn.apply(this, args);
      }, delay);
    };
  }
}
