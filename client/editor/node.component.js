import { EditorService } from './editor.service.js';

class EditorNodeComponent extends HTMLElement {
  constructor() {
    super();
    if (this.hasAttribute('nodeIdentifier')) {
      this._initializeWith(this.getAttribute('nodeIdentifier'));
    }
    this.classList.add('node');
    this.setAttribute('draggable', 'true');
    this.addEventListener('dragstart', (event) => {
      event.dataTransfer.setData(
        'text/html',
        this.getAttribute('nodeIdentifier'),
      );
    });
  }

  static get observedAttributes() {
    return ['nodeIdentifier'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'nodeIdentifier') {
      return this._initializeWith(newValue);
    }
  }

  _initializeWith(nodeIdentifier) {
    this.setAttribute('js-id', nodeIdentifier);
    this.innerHTML = this._render(EditorService.getNode(nodeIdentifier));
  }

  _render(node) {
    return `
      <div class="description">
        <h2>${node.name}</h2>
        <p>${node.description}</p>
      </div>
      <div class="attributes">
        <h3>Attributes</h3>
        ${node.attributes?.map(
          (attribute) =>
            `<div js-id="${attribute.identifier}">${attribute.name}</div>`,
        )}
      </div>
      <div class="inputs">
        <h3>Inputs</h3>
        ${node.inputs?.map(
          (input) => `<div js-id="${input.identifier}">${input.name}</div>`,
        )}
      </div>
      <div class="outputs">
        <h3>Outputs</h3>
        ${node.outputs?.map(
          (output) => `<div js-id="${output.identifier}">${output.name}</div>`,
        )}
      </div>
    `;
  }
}

window.customElements.define('app-editor-node', EditorNodeComponent);
