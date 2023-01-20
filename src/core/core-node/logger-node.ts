import { NodeSingletonDefinition } from '../../domain/node/definition/node-singleton-definition';
import { NodeInputDefinition } from '../../domain/node/definition/node-input-definition';
import { NodeOutputDefinition } from '../../domain/node/definition/node-output-definition';
import { DataHolder } from '../../domain/node/data-holder';
import { Logger } from '@nestjs/common';

export class LoggerNode extends NodeSingletonDefinition {
  identifier = 'logger';
  name = 'Logger';
  description = 'Log input into application console';
  private logger: Logger = new Logger(LoggerNode.name);
  attributes = [];

  inputs = [NodeInputDefinition.from('loggerIn', 'in', 'logs input')];

  outputs = [];

  handleInput(input: NodeInputDefinition, data: DataHolder) {
    this.logger.log(
      `[${this.identifier}][${this.name}]: ${JSON.stringify(data)}`,
    );
  }
}
