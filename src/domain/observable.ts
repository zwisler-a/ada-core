export class Subject<T> implements Observable<T> {
  private observers = [];

  next(next: T) {
    this.observers.forEach((observer) => observer(next));
  }

  subscribe(observer: Observer<T>): Subscription<T> {
    this.observers.push(observer);

    return {
      unsubscribe: () => {
        this.observers = this.observers.filter((o) => o !== observer);
      },
    };
  }

  getObserver() {
    return [...this.observers];
  }
}

export interface Observable<T> {
  subscribe(observer: Observer<T>): Subscription<T>;
}

export interface Subscription<T> {
  unsubscribe();
}

export type Observer<T> = (next: T) => void;
