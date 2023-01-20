import { NodeSingletonDefinition } from '../../domain/node/definition/node-singleton-definition';
import { NodeInputDefinition } from '../../domain/node/definition/node-input-definition';
import { NodeOutputDefinition } from '../../domain/node/definition/node-output-definition';
import { DataHolder } from '../../domain/node/data-holder';
import { Logger } from '@nestjs/common';

export class IntervalNode extends NodeSingletonDefinition {
  identifier = 'interval';
  name = 'Interval';
  description = 'Triggers an output every 5 seconds';
  attributes = [];

  inputs = [];

  outputs = [
    NodeOutputDefinition.from('intervalOut', 'Output', 'Interval Output'),
  ];

  constructor() {
    super();
    setInterval(() => {
      this.updateOutput(this.outputs[0], { currentTime: new Date().getTime() });
    }, 5000);
  }

  handleInput(input: NodeInputDefinition, data: DataHolder) {
    //
  }
}
