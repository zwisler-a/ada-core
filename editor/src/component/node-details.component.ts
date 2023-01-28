import {Component, StatefulComponent} from "../util/component.decorator";
import {NodeInstanceDto} from "../../openapi-typescript-codegen";
import {networksStore, nodeSelector} from "../store/network.store";
import {networkManipulationStore} from "../store/network-manipulation.store";

interface NodeDetailsComponentState {
    node: NodeInstanceDto;
}

const initialState: NodeDetailsComponentState = {
    node: null
}

@Component({
    selector: 'app-node-details'
})
export class NodeDetailsComponent extends StatefulComponent<NodeDetailsComponentState> {

    constructor() {
        super(initialState);
    }

    connectedCallback() {
        super.connectedCallback();
        this.useStore('node', networksStore.select(nodeSelector(
            this.getAttribute('networkId'),
            this.getAttribute('nodeId'),
        )))
    }

    static get observedAttributes() {
        return ['networkId', 'nodeId'];
    }

    attributeChangedCallback() {
        this.useStore('node', networksStore.select(nodeSelector(
            this.getAttribute('networkId'),
            this.getAttribute('nodeId'),
        )));
    }

    close() {
    }

    apply() {
        const node = this.getState().node;
        const name = (this.querySelector('[js-input-name]') as HTMLInputElement).value;
        node.name = name;

        this.querySelectorAll('[js-input]').forEach((element: HTMLInputElement) => {
            const input = element.getAttribute('js-input');
            const att = node.attributes.find(attribute => attribute.identifier === input);
            att.value = element.value;
        })

        networkManipulationStore.updateNode(node);
        this.close();
    }


    render(state: NodeDetailsComponentState): string {
        if (!state.node) return '';
        return `
            <div class="node-card details">
                
                <input js-input-name placeholder="Name" value="${state.node.name}" />
                <table>
                ${state.node.attributes.map(attribute => `
                     <td class="label">${attribute.name}</td><td><input js-input="${attribute.identifier}" placeholder="${attribute.name}" value="${attribute.value}" /></td>
                 `).join('<tr></tr>')}
                </table>
                <div>
                    <button js-click="close">Close</button>
                    <button js-click="apply">Apply</button>
                </div>    
            </div>
        `;
    }
}