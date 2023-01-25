import { DataHolder } from '../../domain/node/data-holder';
import {
  Attribute,
  Deconstruct,
  Input,
  Node,
  Output,
} from '../../domain/proxy';

@Node({
  identifier: 'interval',
  name: 'Interval',
  description: 'Emits a value in a fixed interval',
})
export class IntervalNode {
  private _interval: DataHolder = '5000';
  @Attribute({
    identifier: 'interval',
    name: 'Interval',
    description: 'Time between the emission of values',
  })
  set interval(v: DataHolder) {
    this._interval = v;
    this.setIntervalFromAttributes();
  }

  get interval() {
    return this._interval;
  }

  @Attribute({
    identifier: 'value',
    name: 'Value',
    description: 'Which value should be emitted',
  })
  value: DataHolder;

  private intervalRef: any;

  @Output({
    identifier: 'intervalOut',
    name: 'Output',
    description: 'Output',
  })
  output: (data: DataHolder) => void;

  @Input({
    identifier: 'setInterval',
    name: 'Set interval',
    description: 'Sets the interval of the node',
  })
  setInterval(data: DataHolder) {
    console.log('set inteval', data);
    this.interval = data;
  }

  private setIntervalFromAttributes() {
    if (this.intervalRef) clearInterval(this.intervalRef);
    this.intervalRef = setInterval(() => {
      this.output(this.value ?? new Date().getTime());
    }, +(this.interval ?? 5000));
  }

  @Deconstruct()
  stop() {
    if (this.intervalRef) {
      clearTimeout(this.intervalRef);
    }
  }
}
