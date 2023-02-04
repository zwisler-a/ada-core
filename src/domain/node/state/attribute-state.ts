import { DataHolder } from '../data-holder';
import { NodeState } from './node-state';
import { Subject } from '../../observable';

export class AttributeState extends Subject<any> {
  constructor(private nodeState: NodeState) {
    super();
  }

  value: DataHolder;

  get() {
    return this.value;
  }

  set(value: DataHolder) {
    this.value = value;
    this.nodeState.update();
  }
}
