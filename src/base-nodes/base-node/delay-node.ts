import { Attribute, DataHolder, Input, Node, Output } from '@ada/lib';

@Node({
  identifier: 'delay-node',
  name: 'Delay',
  description: 'This node passes an input to the output with a set delay',
})
export class DelayNode {
  @Attribute({
    identifier: 'delay',
    name: 'Delay',
    description: 'Delay',
  })
  delay: string;

  @Output({
    identifier: 'output',
    name: 'Output',
    description: 'Output',
  })
  output: (data: DataHolder) => void;

  @Input({
    identifier: 'input',
    name: 'Input',
    description: 'Input',
  })
  input(data: DataHolder) {
    if (this.delay) {
      setTimeout(() => this.output(data), +this.delay);
    } else {
      this.output(data);
    }
  }
}
