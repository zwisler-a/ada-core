import { NodeRenderer } from './node.renderer.js';

export class EdgeRenderer {
  /** @type {CanvasRenderingContext2D} */
  ctx;

  constructor(ctx) {
    this.ctx = ctx;
  }

  render(edge, nodes) {
    const start = nodes
      .find((node) => node.identifier === edge.inputNodeIdentifier)
      ?.inputs.find((input) => input.identifier === edge.inputIdentifier);

    const end = nodes
      .find((node) => node.identifier === edge.outputNodeIdentifier)
      ?.outputs.find((input) => input.identifier === edge.outputIdentifier);
    if (!start) console.log('missing start', edge);
    if (!end) console.log('missing end');
    this.ctx.strokeStyle = 'black';

    const s = {
      x: start.x - NodeRenderer.padding,
      y: start.y - NodeRenderer.textSize / 2 + 2,
    };
    const e = {
      x: end.x - NodeRenderer.padding,
      y: end.y - NodeRenderer.textSize / 2 + 2,
    };

    if (s.x + 300 < e.x) {
      s.x += 300;
    } else {
      e.x += 300;
    }

    this.ctx.lineWidth = 2;
    this._connect(s, e);
  }

  _connect(start, end) {
    const distanceX = end.x - start.x;
    this.ctx.beginPath();
    this.ctx.moveTo(start.x, start.y);
    this.ctx.lineTo(start.x + distanceX / 2, start.y);
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(start.x + distanceX / 2, start.y);
    this.ctx.lineTo(start.x + distanceX / 2, end.y);
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(start.x + distanceX / 2, end.y);
    this.ctx.lineTo(end.x, end.y);
    this.ctx.stroke();
  }
}
