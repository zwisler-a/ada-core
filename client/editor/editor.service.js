import { CoreApiService } from '../services/core.service.js';
import { displayNotification } from './util.js';
import { CursorTool } from './tool/cursor.js';
import { ViewerTool } from './tool/viewer.js';
import { ConnectorTool } from './tool/connector.js';
import { DeleteTool } from './tool/delete.js';

class EditorServiceClass {
  network = {
    name: 'New network',
    nodes: [],
    edges: [],
  };
  renderer;
  instance;
  detailsComponent;

  tools = {
    cursor: new CursorTool(),
    viewer: new ViewerTool(),
    connector: new ConnectorTool(),
    deleteNode: new DeleteTool(),
  };
  selectedTool = 'cursor'; // connector, view

  async loadNetwork(networkId) {
    const networks = await CoreApiService.getNetworks();
    const network = networks.find(
      (network) => network.identifier === networkId,
    );
    if (!network) throw new Error("Couldn't find network");
    this.network = network;
    return network;
  }

  mouseDown() {
    return (ev) => {
      this.tools[this.selectedTool].mouseDown(ev);
    };
  }

  mouseMove() {
    return (ev) => {
      this.tools[this.selectedTool].mouseMove(ev);
    };
  }

  mouseUp() {
    return (ev) => {
      this.tools[this.selectedTool].mouseUp(ev);
    };
  }

  saveNetwork() {
    CoreApiService.createOrSave(this.network).then((res) => {
      displayNotification('Network saved', 3000);
    });
  }

  addNode(node) {
    this.network.nodes.push(node);
    this.renderer.render(this.network);
  }

  createEdge(start, end) {
    const edge = {
      inputIdentifier: end.element.identifier,
      inputNodeIdentifier: end.node.identifier,
      outputIdentifier: start.element.identifier,
      outputNodeIdentifier: start.node.identifier,
    };
    this.network.edges.push(edge);
    displayNotification('Edge added', 1000);
  }

  rerender() {
    this.renderer.render(this.network);
  }

  setCursor(cursor) {
    if (cursor === 'drag') this.instance.setDragcursor(true);
    if (cursor === 'pointer') this.instance.setDragcursor(false);
  }
}

export const EditorService = new EditorServiceClass();
