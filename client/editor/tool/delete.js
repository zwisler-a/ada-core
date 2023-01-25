import { EditorService } from '../editor.service.js';
import { Tool } from './tool.js';
import { displayNotification } from '../util.js';

export class DeleteTool extends Tool {
  mouseDown(ev) {
    const clicked = this._getNodeAndElementOn(ev.offsetX, ev.offsetY);
    if (!clicked) return;
    console.log(clicked);
    if (!clicked.element) {
      EditorService.network.nodes = EditorService.network.nodes.filter(
        (n) => n.identifier !== clicked.node.identifier,
      );
      EditorService.network.edges = EditorService.network.edges.filter(
        (edge) =>
          edge.inputNodeIdentifier !== clicked.node.identifier &&
          edge.outputNodeIdentifier !== clicked.node.identifier,
      );
    } else {
      EditorService.network.edges = EditorService.network.edges.filter(
        (edge) =>
          !(
            edge.inputNodeIdentifier === clicked.node.identifier &&
            edge.inputIdentifier === clicked.element.identifier
          ) &&
          !(
            edge.outputNodeIdentifier === clicked.node.identifier &&
            edge.outputIdentifier === clicked.element.identifier
          ),
      );
    }
    EditorService.rerender();
  }

  mouseMove(ev) {}

  mouseUp(ev) {}
}
