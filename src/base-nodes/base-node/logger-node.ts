import { Logger } from '@nestjs/common';
import { DataHolder, Input, Node, NodeDefinition } from '@zwisler/ada-lib';

@Node({
  identifier: 'logger',
  name: 'Logger',
  description: 'Logs the input into the server console.',
})
export class LoggerNode {
  private name;
  private identifier;

  constructor(definition: NodeDefinition, private logger: Logger) {
    this.name = definition.name;
    this.identifier = definition.identifier;
  }

  @Input({
    identifier: 'input',
    name: 'Logger input',
    description: 'Logs the input',
  })
  handleInput(data: DataHolder) {
    this.logger.log(
      `[${this.identifier}][${this.name}]: ${JSON.stringify(data)}`,
    );
  }
}
