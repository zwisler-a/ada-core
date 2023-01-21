import { CoreApiService } from '../services/core.service.js';

class EditorServiceClass {
  network;
  existingSpans = [];

  async loadNetwork(networkId) {
    const networks = await CoreApiService.getNetworks();
    const network = networks.find(
      (network) => network.identifier === networkId,
    );
    if (!network) throw new Error("Couldn't find network");
    this.network = network;
    return network;
  }

  getNode(identifier) {
    return this.network.nodes.find((node) => node.identifier === identifier);
  }

  getOffset(el) {
    let rect = el.getBoundingClientRect();
    return {
      left: rect.left + window.pageXOffset,
      top: rect.top + window.pageYOffset,
      width: rect.width || el.offsetWidth,
      height: rect.height || el.offsetHeight,
    };
  }

  getMiddleRight(off) {
    const x = off.left + off.width;
    const y = off.top + off.height / 2;
    return { x, y };
  }

  getMiddleLeft(off) {
    const x = off.left;
    const y = off.top + off.height / 2;
    return { x, y };
  }

  getDistance(pos1, pos2) {
    const x1 = pos1.x,
      x2 = pos2.x,
      y1 = pos1.y,
      y2 = pos2.y;
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)) - 18;
  }

  connect(div1, div2, color, thickness) {
    // draw a line connecting elements
    const off1 = this.getOffset(div1);
    const off2 = this.getOffset(div2);
    // bottom right
    const left1 = this.getMiddleLeft(off1);
    const right1 = this.getMiddleRight(off1);

    const left2 = this.getMiddleLeft(off2);
    const right2 = this.getMiddleRight(off2);

    let length = 0;
    let x1, x2, y1, y2;
    if (this.getDistance(left1, right2) < this.getDistance(right1, left2)) {
      x1 = left1.x;
      y1 = left1.y;
      x2 = right2.x;
      y2 = right2.y;
      length = this.getDistance(left1, right2);
    } else {
      x1 = right1.x;
      y1 = right1.y;
      x2 = left2.x;
      y2 = left2.y;
      length = this.getDistance(left2, right1);
    }
    console.log(x1, x2, y1, y2, length);

    //const x1 = off1.left + off1.width;
    //const y1 = off1.top + off1.height / 2;
    // middle right
    //const x2 = off2.left + off2.width;
    //const y2 = off2.top + off2.height / 2;
    // distance
    // center
    const cx = (x1 + x2) / 2 - length / 2;
    const cy = (y1 + y2) / 2 - thickness / 2;
    // angle
    const angle = Math.atan2(y1 - y2, x1 - x2) * (180 / Math.PI);

    console.log(cx, cy);

    // make hr
    const htmlLine = `<div style="padding:0px; margin:0px; height:${thickness}px; background-color:${color}; line-height:1px; position:absolute; left:${cx}px; top:${cy}px; width:${length}px; transform:rotate(${angle}deg);" />`;
    //
    // alert(htmlLine);
    const span = document.createElement('span');
    span.innerHTML = htmlLine;
    return span;
  }

  drawEdges() {
    this.existingSpans.forEach((span) => {
      document.body.removeChild(span);
    });
    this.existingSpans = [];

    this.network.edges.forEach((edge) => {
      const input = document.querySelector(
        `[js-id="${edge.inputNodeIdentifier}"] [js-id="${edge.inputIdentifier}"]`,
      );
      const output = document.querySelector(
        `[js-id="${edge.outputNodeIdentifier}"] [js-id="${edge.outputIdentifier}"]`,
      );
      if (input && output) {
        const span = this.connect(input, output, 'black', 2);
        document.body.appendChild(span);
        this.existingSpans.push(span);
      }
    });
  }
}

export const EditorService = new EditorServiceClass();
