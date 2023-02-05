import { Logger } from '@nestjs/common';
import {
  DataHolder,
  Input,
  Node,
  NodeDefinition,
  NodeInstance,
} from '@ada/lib';

@Node({
  identifier: 'logger',
  name: 'Logger',
  description: 'Logs the input into the server console.',
})
export class LoggerNode extends NodeInstance {
  constructor(definition: NodeDefinition, private logger: Logger) {
    super(definition, null);
    this.name = definition.name;
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
