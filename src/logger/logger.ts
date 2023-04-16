import { ConsoleLogger, Injectable, LogLevel } from '@nestjs/common';
import { shareReplay, Subject } from 'rxjs';

export interface LogMessage {
  level: LogLevel;
  message: string;
}

@Injectable()
export class RetainingLogger extends ConsoleLogger {
  private logSubject$ = new Subject<LogMessage>();
  readonly log$ = this.logSubject$.pipe(shareReplay(1000));

  constructor() {
    super();
    this.log$.subscribe();
  }

  log(message: any, ...optionalParams: any[]) {
    super.log(message, ...optionalParams);
    this.logSubject$.next({
      level: 'log',
      message: this.messageToString(message),
    });
  }

  error(message: any, ...optionalParams: any[]) {
    super.log(message, ...optionalParams);
    this.logSubject$.next({
      level: 'error',
      message: this.messageToString(message),
    });
  }

  warn(message: any, ...optionalParams: any[]) {
    super.log(message, ...optionalParams);
    this.logSubject$.next({
      level: 'warn',
      message: this.messageToString(message),
    });
  }

  debug(message: any, ...optionalParams: any[]) {
    super.log(message, ...optionalParams);
    this.logSubject$.next({
      level: 'debug',
      message: this.messageToString(message),
    });
  }

  verbose(message: any, ...optionalParams: any[]) {
    super.log(message, ...optionalParams);
    this.logSubject$.next({
      level: 'verbose',
      message: this.messageToString(message),
    });
  }

  private messageToString(msg: any): string {
    if (typeof msg === 'string') return msg;
    return JSON.stringify(msg);
  }
}
