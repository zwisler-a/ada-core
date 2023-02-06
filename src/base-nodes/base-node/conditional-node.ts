import { Attribute, DataHolder, Input, Node, Output } from '@zwisler/ada-lib';

@Node({
  identifier: 'conditional',
  name: 'Conditional',
  description: 'Outputs depending on condition',
})
export class ConditionalNode {
  @Attribute({
    identifier: 'condition-function',
    name: 'Condition function',
    description: 'If it returns true, maps the output to true, false otherwise',
  })
  mapperFunc: string;

  @Output({
    identifier: 'true-out',
    name: 'True',
    description: 'Triggered if conditional is true',
  })
  trueOutput: (data: DataHolder) => void;

  @Output({
    identifier: 'false-out',
    name: 'False',
    description: 'Triggered if conditional is false',
  })
  falseOutput: (data: DataHolder) => void;

  @Input({
    identifier: 'in',
    name: 'Input',
    description: 'Input of the conditional function',
  })
  handleInput(data: DataHolder) {
    const attr = this.mapperFunc;
    const func = new Function('object', `return (${attr})(object)`);
    const conditional = func(data);
    if (!!conditional) {
      this.trueOutput(data);
    } else {
      this.falseOutput(data);
    }
  }
}
