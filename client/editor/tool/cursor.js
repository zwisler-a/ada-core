import { EditorService } from '../editor.service.js';
import { Tool } from './tool.js';

export class CursorTool extends Tool {
  mouseDown(ev) {
    const clicked = this._getNodeAndElementOn(ev.offsetX, ev.offsetY);
    if (!clicked) return;
    this.draggingOffsetX = clicked.node.x - ev.clientX;
    this.draggingOffsetY = clicked.node.y - ev.clientY;
    clicked.node.isDragging = true;
    this.draggingNode = clicked.node;
    EditorService.setCursor('drag');
  }

  mouseMove(ev) {
    if (!this.draggingNode) return;
    this.draggingNode.x = ev.clientX + this.draggingOffsetX;
    this.draggingNode.y = ev.clientY + this.draggingOffsetY;
    EditorService.rerender();
  }

  mouseUp(ev) {
    if (!this.draggingNode) return;
    this.draggingNode.isDragging = false;
    this.draggingNode = null;
    EditorService.setCursor('pointer');
  }
}
