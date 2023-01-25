import { EditorService } from './editor.service.js';
import { EditorRenderer } from './renderer/editor.renderer.js';
import './components/available-nodes.component.js';
import './components/node-details.component.js';

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
        EditorService.network.name =
          document.querySelector('[js-name]')?.value ??
          EditorService.network.name;
        EditorService.saveNetwork();
      }
      if (ev.target.hasAttribute('js-tool')) {
        EditorService.selectedTool = ev.target.getAttribute('js-tool');
        this._renderToolbar();
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
    EditorService.renderer = new EditorRenderer(this.ctx, this.canvas);
    await EditorService.loadNetwork(networkId);
    document.querySelector('[js-name]').value = EditorService.network.name;
    EditorService.rerender();
    EditorService.rerender();
  }

  setDragcursor(there) {
    if (there) {
      this.classList.add('dragging');
    } else {
      this.classList.remove('dragging');
    }
  }

  _tool(tool) {
    if (EditorService.selectedTool === tool) {
      return `class="active"`;
    } else {
      return `js-tool=${tool}`;
    }
  }

  _renderToolbar() {
    if (!this._toolbar) return;
    this._toolbar.innerHTML = `
        <a href="/network">Back</a>
        <button  js-action="save">Save</button>
        <button ${this._tool('cursor')}>
          <span class="material-symbols-outlined">arrow_selector_tool</span>
        </button>
        <button ${this._tool('connector')}>
          <span class="material-symbols-outlined">share</span>
        </button>
        <button ${this._tool('viewer')}>
          <span class="material-symbols-outlined">settings_applications</span>
        </button>
        <button ${this._tool('deleteNode')}>
          <span class="material-symbols-outlined">delete</span>
        </button>
    `;
  }

  _render() {
    this.innerHTML = `
      <div class="toolbar"></div>
      <input value="${EditorService.network.name}" js-name placeholder="Network Name" />
      <app-node-details js-id="details"></app-node-details>
      <app-available-nodes></app-available-nodes>
      <canvas id="canvas"></canvas>
    `;
    EditorService.detailsComponent = this.querySelector('[js-id="details"]');
    this._toolbar = this.querySelector('[class="toolbar"]');
    this._renderToolbar();
  }
}

window.customElements.define('app-network-editor', NetworkEditorComponent);
