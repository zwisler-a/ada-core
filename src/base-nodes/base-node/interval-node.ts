import { NodeInputDefinition } from '../../domain/node/definition/node-input-definition';
import { NodeOutputDefinition } from '../../domain/node/definition/node-output-definition';
import { DataHolder } from '../../domain/node/data-holder';
import { NodeInstance } from '../../domain/node/instance/node-instance';
import { NodeDefinition } from '../../domain/node/definition/node-definition';
import { NodeAttributeDefinition } from '../../domain/node/definition/node-attribute-definition';

export class IntervalNodeInstance extends NodeInstance {
  private interval: any;

  handleInput(input: NodeInputDefinition, data: DataHolder) {
    if (input.identifier === 'setInterval') {
      this.updateAttribute('interval', data);
      this.setIntervalFromAttributes();
    }
  }

  private setIntervalFromAttributes() {
    const timeout = this.getAttribute('interval') ?? 5000;
    if (this.interval) clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.updateOutput(
        this.outputs[0].definition,
        this.getAttribute('value') ?? new Date().getTime(),
      );
    }, +timeout);
  }

  onAttributeChange(identifier: string, value: DataHolder) {
    this.setIntervalFromAttributes();
  }
}

export class IntervalNode extends NodeDefinition {
  identifier = 'interval';
  name = 'Interval';
  description =
    'Triggers the output in a fixed interval. Defaults to 5 if attribute is not set';
  attributes = [
    NodeAttributeDefinition.from(
      'interval',
      'Interval Timeout',
      'How often this node should emit',
    ),
    NodeAttributeDefinition.from(
      'value',
      'Value',
      'Value which should be emitted',
    ),
  ];

  inputs = [
    NodeInputDefinition.from(
      'setInterval',
      'Interval',
      'Sets the interval of the output',
    ),
  ];

  outputs = [
    NodeOutputDefinition.from('intervalOut', 'Output', 'Interval Output'),
  ];

  constructor() {
    super();
  }

  createInstance(): NodeInstance {
    return new IntervalNodeInstance(this);
  }
}
