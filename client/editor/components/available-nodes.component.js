import { CoreApiService } from '../../services/core.service.js';
import { uuidv4 } from '../util.js';

class AvailableNodesComponent extends HTMLElement {
  constructor() {
    super();
    CoreApiService.getAvailableNodes().then((nodes) => {
      this.nodes = nodes;
      this._render(nodes);
    });
    this.addEventListener('click', (ev) => {
      const nodeDefId = ev.target.getAttribute('js-add');
      this.dispatchEvent(
        new CustomEvent('add-node', {
          detail: this.nodeFromDefinition(nodeDefId),
          bubbles: true,
        }),
      );
    });
  }

  nodeFromDefinition(defId) {
    const def = this.nodes.find((nodeDef) => nodeDef.identifier === defId);
    if (!def) return;
    return {
      x: 10,
      y: 10,
      identifier: uuidv4(),
      name: def.name,
      description: '',
      definitionId: defId,
      attributes: def.attributes.map((attr) => ({
        name: attr.name,
        identifier: attr.identifier,
        value: '',
      })),
      inputs: def.inputs.map((attr) => ({
        name: attr.name,
        identifier: attr.identifier,
      })),
      outputs: def.outputs.map((attr) => ({
        name: attr.name,
        identifier: attr.identifier,
      })),
    };
  }

  _uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
      (
        c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16),
    );
  }

  _render(nodes) {
    const html = nodes
      .map((node) => {
        return `<div js-add="${node.identifier}" class="node"><h3>${node.name}</h3><p>${node.description}</p></div>`;
      })
      .join('');
    this.innerHTML = `<div class="available-nodes">${html}</div>`;
  }
}

window.customElements.define('app-available-nodes', AvailableNodesComponent);
