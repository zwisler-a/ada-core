import {Component, StatefulComponent} from "../util/component.decorator";
import {availableNodesStore} from "../store/available-nodes.store";
import {NodeInstanceDto} from "../../openapi-typescript-codegen";
import {StoreState} from "../store/store";
import {networkManipulationStore} from "../store/network-manipulation.store";

interface AvailableNodesComponentState {
    nodes: StoreState<NodeInstanceDto[]>;
    isOpen: boolean;
}

const initialState: AvailableNodesComponentState = {
    nodes: {loading: true},
    isOpen: false
}

@Component({
    selector: 'app-available-nodes'
})
export class AvailableNodesComponent extends StatefulComponent<AvailableNodesComponentState> {

    constructor() {
        super(initialState);
        this.useStore('nodes', availableNodesStore)
    }

    toggleDisplay() {
        this.updateState({isOpen: !this.getState().isOpen})
    }

    addNode(ev) {
        const element = ev.target.closest("[js-node-def-id]")
        const defId = (element.getAttribute('js-node-def-id'));
        networkManipulationStore.addNode(defId);
    }

    render(state: AvailableNodesComponentState): string {
        if (!state.isOpen) {
            return `<button js-click="toggleDisplay">AvailableNodes</button>`
        }
        if (state.nodes.loading) return '...';
        const nodeHtml = state.nodes.data.map(node => `
                    <div class="node-card" js-click="addNode" js-node-def-id="${node.identifier}" >
                        <h1>${node.name} <button>Add</button></h1>
                        <p>${node.description}</p>
                    </div>
                `).join('')

        return `<div>
            <button js-click="toggleDisplay">Close</button>
            <div class="node-container">
                ${nodeHtml}
            </div>
        </div>`;

    }
}