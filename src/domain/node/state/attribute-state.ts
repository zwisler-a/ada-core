import { DataHolder } from '../data-holder';

export class AttributeState {
  value: DataHolder;

  get() {
    return this.value;
  }

  set(value: DataHolder) {
    this.value = value;
  }
}
