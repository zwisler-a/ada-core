import { DataHolder, Input, Node, Output } from '@zwisler/ada-lib';
import { Logger } from '@nestjs/common';

@Node({
  identifier: 'loop',
  name: 'Loop Node',
  description: 'Node that emits for each element in the input array',
})
export class LoopNode {
  @Output({
    identifier: 'out',
    name: 'Data',
    description: 'Element of the array',
  })
  output: (data: DataHolder) => void;

  @Input({
    identifier: 'in',
    name: 'Input',
    description: 'Data to iterate',
  })
  handleInput(data: DataHolder) {
    if (!Array.isArray(data)) {
      Logger.log('Input is not an array');
      return;
    }
    data.forEach((el) => this.output(el));
  }
}
