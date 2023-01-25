import { EditorService } from '../editor.service.js';
import { Tool } from './tool.js';
import { displayNotification } from '../util.js';

export class ConnectorTool extends Tool {
  mouseDown(ev) {
    const clicked = this._getNodeAndElementOn(ev.offsetX, ev.offsetY);
    if (!clicked) return;
    if (!(clicked.node.outputs || []).includes(clicked.element)) {
      displayNotification('Please select an output!', 1000);
    } else {
      this.connectingElement = clicked;
    }
  }

  mouseMove(ev) {}

  mouseUp(ev) {
    if (this.connectingElement) {
      const clicked = this._getNodeAndElementOn(ev.offsetX, ev.offsetY);
      console.log(clicked);
      if (clicked) {
        if (!(clicked.node.inputs || []).includes(clicked.element)) {
          displayNotification('Please select an input!', 1000);
          return;
        } else {
          EditorService.createEdge(this.connectingElement, clicked);
        }

        this.connectingElement = null;
        EditorService.rerender();
      }
    }
  }
}
