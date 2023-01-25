import { Tool } from './tool.js';
import { EditorService } from '../editor.service.js';

export class ViewerTool extends Tool {
  mouseDown(ev) {
    const clicked = this._getNodeAndElementOn(ev.offsetX, ev.offsetY);
    if (!clicked) return;
    EditorService.detailsComponent.load(clicked.node);
  }

  mouseMove() {}

  mouseUp() {}
}
