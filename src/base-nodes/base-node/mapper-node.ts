import { DataHolder } from '../../domain/node/data-holder';
import { Node } from '../../domain/proxy';
import { Attribute } from '../../domain/proxy';
import { Output } from '../../domain/proxy';
import { Input } from '../../domain/proxy';

@Node({
  identifier: 'mapper',
  name: 'Mapper',
  description: 'Maps by the provided function',
})
export class MapperNode {
  @Attribute({
    identifier: 'MapperFunction',
    name: 'Mapper function',
    description: 'Function to map data',
  })
  mapperFunc: string;

  @Output({
    identifier: 'out',
    name: 'Output',
    description: 'Output of the function',
  })
  output: (data: DataHolder) => void;

  @Input({
    identifier: 'in',
    name: 'Input',
    description: 'Input of the mapper function',
  })
  handleInput(data: DataHolder) {
    const attr = this.mapperFunc;
    const func = new Function('object', `return (${attr})(object)`);
    this.output(func(data));
  }
}
