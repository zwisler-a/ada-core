import {Component, StatefulComponent} from "../util/component.decorator";

interface ContextmenuComponentState {
    options: { label: string, callback: () => void }[]
}

const initialState: ContextmenuComponentState = {
    options: []
}

@Component({
    selector: 'app-editor-context-menu'
})
export class ContextmenuComponent extends StatefulComponent<ContextmenuComponentState> {


    constructor() {
        super(initialState);
    }


    static get observedAttributes() {
        return ["networkId"];
    }

    handleOption(ev) {
        const option = ev.target.closest('[js-option]')
        const optionIdx = Number.parseInt(option.getAttribute('js-option'));
        this.getState().options[optionIdx].callback();
    }


    render(state) {
        return `<div class="context-menu">
            ${state.options.map((option, idx) => {
                return `<button js-click="handleOption" js-option="${idx}">${option.label}</button>`
            }).join('')}
        </div>`;
    }
}