import { DataHolder } from '../../domain/node/data-holder';
import { Logger } from '@nestjs/common';
import { NodeInstance } from '../../domain/node/instance/node-instance';
import { NodeDefinition } from '../../domain/node/definition/node-definition';
import { Node } from '../../domain/proxy';
import { Input } from '../../domain/proxy';

@Node({
  identifier: 'logger',
  name: 'Logger',
  description: 'Logs the input into the server console.',
})
export class LoggerNode extends NodeInstance {
  constructor(definition: NodeDefinition, private logger: Logger) {
    super(definition);
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
