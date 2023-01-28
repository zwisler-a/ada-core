import {BehaviorSubject, filter, map, mergeMap, Observable, OperatorFunction, Subject} from "rxjs";

export interface StoreState<T> {
    loading: boolean,
    data?: T
}

export class Store<T> extends BehaviorSubject<StoreState<T>> {
    constructor(private fetchFunction: () => Promise<T>) {
        super({loading: true});
        this.fetchData()
    }

    private fetchData() {
        this.next({loading: true, data: null});
        this.fetchFunction().then(data => {
            this.next({loading: false, data})
        })
    }

    refresh() {
        return this.fetchFunction().then(data => {
            this.next({loading: false, data})
        })
    }

    select<G>(selector: OperatorFunction<T, G>): Observable<G> {
        return this.pipe(map(d => d.data), filter(d => !!d), selector)
    }
}