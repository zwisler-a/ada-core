import { CoreApiService } from '../services/core.service.js';
import { NodeRenderer } from './renderer/node.renderer.js';

class EditorServiceClass {
  network = {
    name: 'New network',
    nodes: [],
    edges: [],
  };
  renderer;
  instance;
  detailsComponent;

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
      const clicked = this._getNodeAndElementOn(ev.offsetX, ev.offsetY);
      if (!clicked) return;
      if (this.selectedTool === 'cursor') {
        this.draggingOffsetX = clicked.node.x - ev.clientX;
        this.draggingOffsetY = clicked.node.y - ev.clientY;
        clicked.node.isDragging = true;
        this.draggingNode = clicked.node;
        this.instance.setDragcursor(true);
      }
      if (this.selectedTool === 'connector') {
        this.connectingElement = clicked;
      }
      if (this.selectedTool === 'view') {
        this.detailsComponent.load(clicked.node);
      }
    };
  }

  mouseMove() {
    return (ev) => {
      let dirty = false;
      if (this.draggingNode) {
        this.draggingNode.x = ev.clientX + this.draggingOffsetX;
        this.draggingNode.y = ev.clientY + this.draggingOffsetY;
        dirty = true;
      }
      if (dirty) this.renderer.render(EditorService.network);
    };
  }

  mouseUp() {
    return (ev) => {
      if (this.connectingElement) {
        const clicked = this._getNodeAndElementOn(ev.offsetX, ev.offsetY);
        console.log(clicked);
        if (clicked) {
          this._createEdge(this.connectingElement, clicked);
          this.connectingElement = null;
          this.renderer.render(this.network);
        }
      }
      if (!this.draggingNode) return;
      this.draggingNode.isDragging = false;
      this.draggingNode = null;
      this.instance.setDragcursor(false);
    };
  }

  saveNetwork() {
    CoreApiService.createOrSave(this.network).then((res) => console.log(res));
  }

  addNode(node) {
    this.network.nodes.push(node);
    this.renderer.render(this.network);
  }

  _getNodeAndElementOn(offsetX, offsetY) {
    const clickedNode = EditorService.network.nodes.find(
      (node) =>
        offsetX > node.x &&
        node.x + node.width > offsetX &&
        offsetY > node.y &&
        offsetY < node.y + node.height,
    );
    if (!clickedNode) return;
    const rowClicked = Math.floor(
      (offsetY - clickedNode.y - NodeRenderer.headerHeight) /
        NodeRenderer.rowHeight,
    );
    const clickedElement = [
      ...clickedNode.attributes,
      ...clickedNode.inputs,
      ...clickedNode.outputs,
    ][rowClicked];
    return { node: clickedNode, element: clickedElement };
  }

  _createEdge(start, end) {
    const edge = {
      inputIdentifier: end.element.identifier,
      inputNodeIdentifier: end.node.identifier,
      outputIdentifier: start.element.identifier,
      outputNodeIdentifier: start.node.identifier,
    };
    console.log(edge);
    this.network.edges.push(edge);
  }

  rerender() {
    this.renderer.render(this.network);
  }

  _uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
      (
        c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16),
    );
  }
}

export const EditorService = new EditorServiceClass();
