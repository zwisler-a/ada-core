import {Store} from "../store/store";
import {Observable, Subscription} from "rxjs";

interface ComponentConfiguration {
    selector: string;
}

export function Component(config: ComponentConfiguration) {
    return (constructor) => {
        window.customElements.define(config.selector, constructor);
    }
}

export abstract class StatefulComponent<T extends object> extends HTMLElement {
    private state: T;
    private subscription: Subscription;

    protected constructor(initialState: T) {
        super();
        this.state = initialState
    }

    setState(state: T) {
        this.state = state;
        this.triggerRender();
    }

    updateState(state: Partial<T>) {
        this.state = Object.assign({}, this.state, state);
        this.triggerRender();
    }

    connectedCallback() {
        this.triggerRender();
    }

    static get observedAttributes() {
        return [];
    }

    attributeChangedCallback(name, oldValue, newValue) {

    }

    getState(): T {
        return this.state;
    }

    useStore(stateKey: string, store: Observable<any>) {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        this.subscription = store.subscribe(data => {
            this.setState({...this.getState(), [stateKey]: data});
        })
    }

    disconnectedCallback() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    triggerRender() {
        const html = this.render(this.state);
        if (!html) return;
        this.innerHTML = html;
        this.addClickHandlers();
    }

    abstract render(state: T);


    private addClickHandlers() {
        const clickElements = this.querySelectorAll('[js-click]');
        clickElements.forEach(el => {
            el.addEventListener('click', (ev) => {
                const clickHandler = el.getAttribute('js-click');
                if (clickHandler && this[clickHandler]) {
                    this[clickHandler](ev)
                }
            })
        })
    }
}