import {
  Attribute,
  DataHolder,
  Deconstruct,
  Initialize,
  Node,
  Output,
} from '@zwisler/ada-lib';
import { HttpService } from '@nestjs/axios';
import { CronJob } from 'cron';

@Node({
  identifier: 'cron',
  name: 'Cron Node',
  description: 'Combines the latest two values',
})
export class CronNode {
  private _cron: string;
  private cronJob: CronJob;

  @Attribute({
    identifier: 'Cron',
    name: 'Cron',
  })
  set cron(c: string) {
    this._cron = c;
    this.createCron();
  }

  get cron() {
    return this._cron;
  }

  @Attribute({
    identifier: 'data',
    name: 'data',
  })
  data: string;

  @Initialize()
  createCron() {
    if (this.cronJob && this.cronJob.running) {
      this.cronJob.stop();
    }
    this.cronJob = new CronJob(this.cron, () => {
      this.output(this.data);
    });
    if (!this.cronJob.running) {
      this.cronJob.start();
    }
  }

  @Deconstruct()
  stop() {
    if (this.cronJob && this.cronJob.running) {
      this.cronJob.stop();
    }
  }

  constructor(private http: HttpService) {}

  @Output({
    identifier: 'out',
    name: 'Trigger',
    description: '',
  })
  output: (data: DataHolder) => void;
}
