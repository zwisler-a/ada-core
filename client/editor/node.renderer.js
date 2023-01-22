export class NodeRenderer {
  /** @type {CanvasRenderingContext2D} */
  ctx;

  static padding = 16;
  static rowHeight = 35;
  static textSize = 16;
  static headerHeight = 60;

  constructor(ctx) {
    this.ctx = ctx;
  }

  render(node) {
    const headerHeight = NodeRenderer.headerHeight;
    const padding = NodeRenderer.padding;
    const rowHeight = NodeRenderer.rowHeight;
    const rowsCount =
      node.attributes.length + node.inputs.length + node.outputs.length;
    const nodeHeight = headerHeight + rowsCount * rowHeight;

    this.ctx.clearRect(node.x, node.y, 300, nodeHeight);

    this.ctx.strokeStyle = 'gray';
    this.ctx.fillStyle = 'black';
    this.ctx.font = `21px Arial`;
    this.ctx.fillText(node.name, node.x + padding, node.y + padding + 21);

    this.ctx.beginPath();
    this.ctx.moveTo(node.x, node.y + padding + 21 + 18);
    this.ctx.lineTo(node.x + 300, node.y + padding + 21 + 18);
    this.ctx.stroke();

    this.ctx.font = `${NodeRenderer.textSize}px Arial`;

    const yPos = (row) =>
      node.y +
      row * rowHeight +
      headerHeight -
      rowHeight / 2 +
      NodeRenderer.textSize / 2 -
      3;

    let rows = 0;
    node.attributes?.forEach((attr) => {
      rows++;
      attr.x = node.x + padding;
      attr.y = yPos(rows);
      this.ctx.fillText(attr.name, attr.x, attr.y);

      const displayValue = JSON.stringify(attr.value.slice(0, 10));
      const txtMeasure = this.ctx.measureText(displayValue);
      this.ctx.fillText(
        displayValue,
        attr.x + 300 - txtMeasure.width - padding * 2,
        attr.y,
      );
    });
    this.ctx.fillStyle = 'rgba(0,0,0,0.1)';
    this.ctx.fillRect(
      node.x,
      node.y + rows * rowHeight + headerHeight,
      300,
      rowHeight * node.inputs.length,
    );
    this.ctx.fillStyle = 'black';
    node.inputs?.forEach((attr) => {
      rows++;
      attr.x = node.x + padding;
      attr.y = yPos(rows);
      this.ctx.fillText(attr.name, attr.x, attr.y);
    });
    node.outputs?.forEach((attr) => {
      rows++;
      attr.x = node.x + padding;
      attr.y = yPos(rows);
      this.ctx.fillText(attr.name, attr.x, attr.y);
    });
    this.ctx.strokeStyle = 'black';
    this.ctx.fillStyle = 'white';

    node.width = 300;
    node.height = nodeHeight;
    this.ctx.strokeRect(node.x, node.y, node.width, node.height);
  }
}
