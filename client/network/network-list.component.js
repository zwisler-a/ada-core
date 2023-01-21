import { CoreApiService } from '../services/core.service.js';

class NetworkListComponent extends HTMLElement {
  constructor() {
    super();
    this._loadNetworks();
    this.addEventListener('click', (ev) => {
      if (ev.target.getAttribute('js-action-delete')) {
        this._deleteNetwork(ev.target.getAttribute('js-action-delete'));
      }
      if (ev.target.getAttribute('js-action-start')) {
        this._startNetwork(ev.target.getAttribute('js-action-start'));
      }
      if (ev.target.getAttribute('js-action-stop')) {
        this._stopNetwork(ev.target.getAttribute('js-action-stop'));
      }
    });
  }

  _loadNetworks() {
    CoreApiService.getNetworks().then((networks) => {
      this.innerHTML = this._render(networks);
    });
  }

  _deleteNetwork(networkId) {
    CoreApiService.deleteNetwork(networkId).then((res) => {
      this._loadNetworks();
    });
  }

  _startNetwork(networkId) {
    CoreApiService.startNetwork(networkId).then((res) => {
      this._loadNetworks();
    });
  }

  _stopNetwork(networkId) {
    CoreApiService.stopNetwork(networkId).then((res) => {
      this._loadNetworks();
    });
  }

  _render(networks) {
    const listHTML = networks
      .map(
        (network) =>
          `<div class="list-item">
              <b>${network.active ? 'Running' : 'Stopped'}</b>
              <span class="list-spacer"><small>${network.identifier}</small> ${
            network.name
          }</span>
              <button js-action-start="${network.identifier}">start</button>
              <button js-action-stop="${network.identifier}">stop</button>
              <a href="/editor?networkId=${
                network.identifier
              }"><button>view</button></a>
              <button js-action-delete="${network.identifier}">delete</button>
            </div>`,
      )
      .join('');
    return `
      <div class="list">${listHTML}</div>
    `;
  }
}

window.customElements.define('app-network-list', NetworkListComponent);
