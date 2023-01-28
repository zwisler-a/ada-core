import { Component, StatefulComponent } from '../util/component.decorator';
import { CoreService, NetworkDto } from '../../openapi-typescript-codegen';
import { networkManipulationStore } from '../store/network-manipulation.store';
import { notificationStore } from '../store/notification.store';

interface ToolbarComponentState {
  network: NetworkDto;
}

const initialState: ToolbarComponentState = {
  network: null,
};

@Component({
  selector: 'app-toolbar',
})
export class ToolbarComponent extends StatefulComponent<ToolbarComponentState> {
  constructor() {
    super(initialState);
  }

  connectedCallback() {
    this.useStore('network', networkManipulationStore);
  }

  runNetwork() {
    CoreService.startNetwork(this.getAttribute('networkId'))
      .then(() => {
        notificationStore.display({
          content: 'Network started',
          type: 'success',
        });
        networkManipulationStore.refresh();
      })
      .catch((err) => {
        notificationStore.display({
          content: 'Failed to start network ...',
          type: 'error',
        });
      });
  }

  stopNetwork() {
    CoreService.stopNetwork(this.getAttribute('networkId'))
      .then(() => {
        notificationStore.display({
          content: 'Network stopped',
          type: 'success',
        });
        networkManipulationStore.refresh();
      })
      .catch((err) => {
        notificationStore.display({
          content: 'Failed to stop network ...',
          type: 'error',
        });
      });
  }

  saveNetwork() {
    networkManipulationStore
      .save()
      .then(() => {
        notificationStore.display({
          content: 'Network saved',
          type: 'success',
        });
      })
      .catch((err) => {
        notificationStore.display({
          content: 'Failed to save network ...',
          type: 'error',
        });
      });
  }

  render(state) {
    if (!state.network) return '';
    return `<div class="toolbar">
            <a href="/"><button>Close</button></a>
            <b>${state.network?.active ? 'Running' : 'Stopped'}</b>
            <span>${state.network ? state.network.name : ''}</span>
            <span class="flex-fill"></span>
            ${
              state.network?.active
                ? `<button js-click="stopNetwork">Stop Network</button>`
                : `<button js-click="runNetwork">Run Network</button>`
            }
            <button js-click="saveNetwork">Save Network</button>
            
            <app-available-nodes></app-available-nodes>
        </div>`;
  }
}
