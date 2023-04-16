import { DataHolder, Input, Node, Output } from '@zwisler/ada-lib';
import { HttpService } from '@nestjs/axios';

@Node({
  identifier: 'fetch',
  name: 'HTTP Fetch',
  description: 'Combines the latest two values',
})
export class FetchNode {
  constructor(def: any, private http: HttpService) {}

  @Output({
    identifier: 'out',
    name: 'Fetched data',
    description: '',
  })
  output: (data: DataHolder) => void;

  @Input({
    identifier: 'in1',
    name: 'Fetch',
    description: "{url, opts}",
  })
  fetchData(data: DataHolder) {
    if (data['url'] && data['opts']) {
      try {
        this.http
          .request({
            url: data['url'],
            ...data['opts'],
          })
          .subscribe((value) => {
            this.output(value.data);
          });
      } catch (e) {
        console.log(e);
      }
    }
  }
}
