import { NodeOutputDefinition } from '../definition/node-output-definition';
import { NodeInstance } from './node-instance';
import { Observer, Subject } from '../../observable';
import { DataHolder } from '../data-holder';
import { Identifiable } from '../identifiable';

export class NodeOutputInstance extends Identifiable {
  definition: NodeOutputDefinition;
  node: NodeInstance;
  private subject = new Subject<DataHolder>();

  next(data: DataHolder) {
    this.subject.next(data);
  }

  subscribe(fn: Observer<DataHolder>) {
    return this.subject.subscribe(fn);
  }
}
