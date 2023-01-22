import { NodeRenderer } from './node.renderer.js';
import { EdgeRenderer } from './edge.renderer.js';

export class EditorRenderer {
  canvas;
  /** @type {CanvasRenderingContext2D} */
  ctx;

  /** @type {NodeRenderer} */
  nodeRenderer;

  constructor(ctx, canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.nodeRenderer = new NodeRenderer(this.ctx);
    this.edgeRenderer = new EdgeRenderer(this.ctx);
  }

  render(network) {
    window.requestAnimationFrame(() => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      network.edges.forEach((edge, idx) =>
        this.edgeRenderer.render(edge, network.nodes),
      );
      network.nodes.forEach((node, idx) => this.nodeRenderer.render(node, idx));
    });
  }
}
