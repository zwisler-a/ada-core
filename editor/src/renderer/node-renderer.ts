import { NodeInstanceDto } from '../../openapi-typescript-codegen';
import {
  descriptionTextSize,
  headerTextSize,
  linePadding,
  nodePadding,
  nodePaddingVertical,
  rowTextSize,
} from './constants';
import { Camera } from './camera';

export class NodeRenderer {
  constructor(private ctx: CanvasRenderingContext2D) {}

  render(nodes: NodeInstanceDto[], camera: Camera) {
    nodes.forEach((node) => this.renderNode(node, camera));
  }

  private renderNode(node: NodeInstanceDto, cam: Camera) {
    this.ctx.strokeStyle = 'black';
    this.ctx.font = `${headerTextSize}px Arial`;
    const titleMetrics: TextMetrics = this.ctx.measureText(node.name);
    this.ctx.font = `${descriptionTextSize}px Arial`;
    const descriptionMetrics: TextMetrics = this.ctx.measureText(
      node.description,
    );

    this.ctx.font = `${rowTextSize}px Arial`;
    const attributeMetrics: TextMetrics[] =
      node.attributes?.map((o) => this.ctx.measureText(o.name)) ?? [];
    const inputMetrics: TextMetrics[] =
      node.inputs?.map((o) => this.ctx.measureText(o.name)) ?? [];
    const outputMetrics: TextMetrics[] =
      node.outputs?.map((o) => this.ctx.measureText(o.name)) ?? [];

    const minWidth = Math.max(
      titleMetrics.width,
      descriptionMetrics.width,
      ...attributeMetrics.map((m) => m.width),
      ...inputMetrics.map((m) => m.width),
      ...outputMetrics.map((m) => m.width),
    );
    const dynamicRows =
      attributeMetrics.length + inputMetrics.length + outputMetrics.length;
    const dynamicHeight =
      dynamicRows * rowTextSize + (dynamicRows + 1) * linePadding;
    const headerHeight =
      headerTextSize +
      descriptionTextSize +
      linePadding * 2 +
      nodePaddingVertical;
    const width = minWidth + nodePadding * 2;
    const height = headerHeight + dynamicHeight + nodePaddingVertical;

    this.ctx.clearRect(cam.transX(node.x), cam.transY(node.y), width, height);

    let currentRowY = node.y + nodePaddingVertical;
    this.ctx.fillStyle = 'black';
    this.ctx.font = `${headerTextSize}px Arial`;
    currentRowY += headerTextSize;
    this.ctx.fillText(
      node.name,
      cam.transX(node.x + nodePadding),
      cam.transY(currentRowY),
    );

    this.ctx.fillStyle = 'black';
    this.ctx.font = `${descriptionTextSize}px Arial`;
    currentRowY += descriptionTextSize + linePadding;
    this.ctx.fillText(
      node.description,
      cam.transX(node.x + nodePadding),
      cam.transY(currentRowY),
    );

    this.drawLine(
      cam.transX(node.x),
      cam.transY(node.y + headerHeight),
      cam.transX(node.x + width),
      cam.transY(node.y + headerHeight),
    );

    this.ctx.fillStyle = 'black';

    this.ctx.font = `${rowTextSize}px Arial`;
    currentRowY += linePadding;
    const identifiable = [
      ...(node?.attributes ?? []),
      ...(node?.inputs ?? []),
      ...(node?.outputs ?? []),
    ];
    identifiable.forEach((element) => {
      (element as any).pos = {
        x: node.x,
        y: currentRowY + linePadding / 2,
        width,
        height: linePadding + rowTextSize,
      };
      if (node.attributes.includes(element as any)) {
        this.ctx.fillStyle = 'rgba(0,0,0,0.00)';
      }
      if (node.outputs.includes(element as any)) {
        this.ctx.fillStyle = 'rgba(0,82,255,0.06)';
      }
      if (node.inputs.includes(element as any)) {
        this.ctx.fillStyle = 'rgba(85,255,0,0.06)';
      }
      this.ctx.fillRect(
        cam.transX(node.x),
        cam.transY(currentRowY + linePadding / 2),
        width,
        linePadding + rowTextSize,
      );
      this.ctx.fillStyle = 'black';
      currentRowY += rowTextSize + linePadding;
      this.ctx.fillText(
        element.name,
        cam.transX(node.x + nodePadding),
        cam.transY(currentRowY),
      );
    });

    (node as any).pos = {
      x: node.x,
      y: node.y,
      width,
      height,
    };
    this.ctx.beginPath();
    this.ctx.roundRect(
      cam.transX(node.x),
      cam.transY(node.y),
      width,
      height,
      4,
    );
    this.ctx.stroke();
  }

  private drawLine(x, y, x2, y2) {
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
  }
}
