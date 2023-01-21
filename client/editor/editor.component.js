import { EditorService } from './editor.service.js';
import './node.component.js';

class NetworkEditorComponent extends HTMLElement {
  constructor() {
    super();
    this.positions = {};
    this.classList.add('editor');
    const networkId = this.getAttribute('networkId');
    if (networkId) {
      this._initializeWith(networkId);
    }
    this.addEventListener('dragenter', (e) => {
      e.preventDefault();
    });
    this.addEventListener('dragover', (e) => {
      e.preventDefault();
    });
    this.addEventListener('drop', (event) => {
      const nodeIdentifier = event.dataTransfer.getData('text/html');
      this.positions[nodeIdentifier] = {
        x: event.clientX,
        y: event.clientY,
      };
      this._render(EditorService.network);
    });
  }

  static get observedAttributes() {
    return ['networkId'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'networkId') {
      return this._initializeWith(newValue);
    }
  }

  async _initializeWith(networkId) {
    await EditorService.loadNetwork(networkId);
    let x = 0;
    EditorService.network.nodes.forEach((node) => {
      this.positions[node.identifier] = {
        x: x,
        y: 100,
      };
      x += 350;
    });
    this._render(EditorService.network);
  }

  _getNodePositionCss(identifier) {
    if (this.positions[identifier]) {
      const pos = this.positions[identifier];
      return ` style="left:${pos.x}px;top:${pos.y}px" `;
    }
    return '';
  }

  _render(network) {
    this.innerHTML = `
      <a href="/network">Back</a>
     <h1>${network.name}</h1>
     <div>Amount of nodes: ${network.nodes.length}</div>
     <div>Amount of edges: ${network.edges.length}</div>
       ${network.nodes
         .map(
           (node) =>
             `<app-editor-node ${this._getNodePositionCss(
               node.identifier,
             )} nodeIdentifier="${node.identifier}"></app-editor-node>`,
         )
         .join('')}
    `;
    EditorService.drawEdges();
  }
}

window.customElements.define('app-network-editor', NetworkEditorComponent);
