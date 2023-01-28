import { Component, StatefulComponent } from '../util/component.decorator';
import { networkManipulationStore } from '../store/network-manipulation.store';
import { MasterRenderer } from '../renderer/master-rederer';
import { CursorTool } from '../tool/cursor.tool';
import { Tools } from '../tool/tools.enum';
import { map, switchMap } from 'rxjs';
import { cameraStore } from '../store/camera.store';

interface EditorComponentState {
  networkId: string;
}

const initialState: EditorComponentState = {
  networkId: null,
};

@Component({
  selector: 'app-editor',
})
export class EditorComponent extends StatefulComponent<EditorComponentState> {
  private masterRenderer: MasterRenderer;
  private tools: { [key: number]: any } = {};

  constructor() {
    super(initialState);
  }

  async connectedCallback() {
    networkManipulationStore
      .pipe(
        switchMap((network) =>
          cameraStore.pipe(map((camera) => ({ camera, network }))),
        ),
      )
      .subscribe(({ network, camera }) => {
        if (this.masterRenderer) this.masterRenderer.render(network, camera);
        console.log('render');
      });
    if (this.hasAttribute('networkId')) {
      this.updateState({ networkId: this.getAttribute('networkId') });
      this.initializeWith(this.getAttribute('networkId'));
    } else {
      this.updateState({ networkId: networkManipulationStore.createNetwork() });
    }
  }

  static get observedAttributes() {
    return ['networkId'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (this.hasAttribute('networkId')) {
      this.initializeWith(this.getAttribute('networkId'));
    }
  }

  private async initializeWith(networkId: string) {
    await networkManipulationStore.loadNetwork(networkId);
  }

  render(state) {
    this.innerHTML = `
            <app-toolbar networkId="${state.networkId}"></app-toolbar>
            <canvas data-js-id="canvas"></canvas>
            <app-notifications></app-notifications>
        `;
    const canvas = document.querySelector(
      '[data-js-id="canvas"]',
    ) as HTMLCanvasElement;
    this.masterRenderer = new MasterRenderer(canvas);
    this.tools[Tools.CURSOR] = new CursorTool(
      canvas,
      this,
      this.masterRenderer,
    );

    return false;
  }
}
