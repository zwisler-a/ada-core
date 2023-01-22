import { EditorService } from './editor.service.js';
import { EditorRenderer } from './editor.renderer.js';
import './available-nodes.component.js';
import './node-details.component.js';

class NetworkEditorComponent extends HTMLElement {
  constructor() {
    super();
    this.classList.add('editor');
    this._initialize();
    this.addEventListener('mousedown', EditorService.mouseDown());
    this.addEventListener('mouseup', EditorService.mouseUp());
    this.addEventListener('mousemove', EditorService.mouseMove());
    EditorService.instance = this;
    this.addEventListener('click', (ev) => {
      if (ev.target.getAttribute('js-action') === 'save') {
        EditorService.saveNetwork();
      }
      if (ev.target.hasAttribute('js-tool')) {
        EditorService.selectedTool = ev.target.getAttribute('js-tool');
      }
    });

    this.addEventListener('add-node', (ev) => {
      EditorService.addNode(ev.detail);
    });
  }

  static get observedAttributes() {
    return ['networkId'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'networkId') {
      return this._initialize();
    }
  }

  async _initialize() {
    const networkId = this.getAttribute('networkId');
    if (!networkId) {
      return;
    }
    this._render();
    this.canvas = document.getElementById('canvas');
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    const network = await EditorService.loadNetwork(networkId);
    EditorService.renderer = new EditorRenderer(this.ctx, this.canvas);
    EditorService.renderer.render(network);
    EditorService.renderer.render(network); // TODO Quick fix
  }

  setDragcursor(there) {
    if (there) {
      this.classList.add('dragging');
    } else {
      this.classList.remove('dragging');
    }
  }

  _render(network) {
    this.innerHTML = `
      <div class="flex align-center">
        <a href="/network">Back</a>
        <button js-action="save">Save</button>
        <button js-tool="cursor">Cursor</button>
        <button js-tool="connector">Connector</button>
        <button js-tool="view">view</button>
      </div>
      <app-node-details js-id="details"></app-node-details>
      <canvas id="canvas"></canvas>
      <app-available-nodes></app-available-nodes>
    `;
    EditorService.detailsComponent = this.querySelector('[js-id="details"]');
  }
}

window.customElements.define('app-network-editor', NetworkEditorComponent);
