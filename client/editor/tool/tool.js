import { NodeRenderer } from '../renderer/node.renderer.js';
import { EditorService } from '../editor.service.js';

export class Tool {
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
}
