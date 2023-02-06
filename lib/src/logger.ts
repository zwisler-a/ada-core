export interface Logger {
  log(msg: string);
}

export class ConsoleLogger implements Logger {
  log(msg: string) {
    console.log(msg);
  }
}
