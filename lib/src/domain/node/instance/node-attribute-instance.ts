import { NodeAttributeDefinition } from '../definition/node-attribute-definition';
import { Subject } from '../../observable';
import { DataHolder } from '../data-holder';
import { AttributeState } from '../state/attribute-state';

export class NodeAttributeInstance extends Subject<DataHolder> {
  constructor(
    public definition: NodeAttributeDefinition,
    private attributeState: AttributeState,
  ) {
    super();
  }

  get value() {
    return this.attributeState.get();
  }

  set value(value: DataHolder) {
    this.attributeState.set(value);
  }
}
