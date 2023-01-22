import { EditorService } from '../editor.service.js';

class NodeDetailsComponent extends HTMLElement {
  constructor() {
    super();
    this.addEventListener('click', (ev) => {
      if (ev.target.hasAttribute('js-save')) {
        this._save();
      }
    });
  }

  load(node) {
    if (!node) return (this.innerHTML = ``);
    this._node = node;
    this._render();
  }

  _save() {
    this._node.name = this.querySelector('[js-node-name]')?.value;
    this._node.description = this.querySelector('[js-node-description]')?.value;
    this.querySelectorAll('[js-node-attribute]').forEach((el) => {
      const id = el.getAttribute('js-node-attribute');
      this._node.attributes.find((attr) => attr.identifier === id).value =
        el.value;
    });
    this.load();
    EditorService.rerender();
  }

  _render() {
    const attributeInputs = this._node.attributes.map(
      (attr) =>
        `<div><span>${attr.name}:</span> <input value="${attr.value}" js-node-attribute="${attr.identifier}" placeholder="${attr.name}" /></div>`,
    );
    this.innerHTML = `
      <div class="node-details">
        <h2>${this._node.name}</h2>
        <div><span>Name:</span> <input js-node-name value="${this._node.name}" /></div>
        <div><span>Description:</span> <input js-node-description value="${this._node.name}" /></div>
        <b>Attributes</b>
        ${attributeInputs}
        <div>
            <button js-save>Save</button>    
        </div>
      </div>
    `;
  }
}

window.customElements.define('app-node-details', NodeDetailsComponent);
