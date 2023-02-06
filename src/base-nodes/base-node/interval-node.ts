import {
  Attribute,
  DataHolder,
  Deconstruct,
  Initialize,
  Input,
  Node,
  Output,
} from '@zwisler/ada-lib';

@Node({
  identifier: 'interval',
  name: 'Interval',
  description: 'Emits a value in a fixed interval',
})
export class IntervalNode {
  private _time: DataHolder = '5000';

  @Attribute({
    identifier: 'interval',
    name: 'Interval',
    description: 'Time between the emission of values',
  })
  set interval(v: DataHolder) {
    this._time = v;
    this.setIntervalFromAttributes();
  }

  get interval() {
    return this._time ?? 5000;
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
    this.interval = data;
  }

  @Input({
    identifier: 'start-interval',
    name: 'Start interval',
    description: 'Starts the interval if stopped',
  })
  startInterval() {
    this.setIntervalFromAttributes();
  }

  @Input({
    identifier: 'stop-interval',
    name: 'Stop interval',
    description: 'Stops the interval if stopped',
  })
  stopInterval() {
    if (this.intervalRef) {
      clearInterval(this.intervalRef);
      this.intervalRef = null;
    }
  }

  @Initialize()
  private setIntervalFromAttributes() {
    if (this.intervalRef) {
      clearInterval(this.intervalRef);
      this.intervalRef = null;
    }
    this.intervalRef = setInterval(() => {
      this.output(this.value ?? new Date().getTime());
    }, +this.interval ?? 5000);
  }

  @Deconstruct()
  stop() {
    if (this.intervalRef) {
      clearTimeout(this.intervalRef);
    }
  }
}
