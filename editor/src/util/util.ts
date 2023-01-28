import { NodeInstanceDto } from '../../openapi-typescript-codegen';

export function uuidv4() {
  // @ts-ignore
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16),
  );
}

export function getClickedNode(nodes: NodeInstanceDto[], x, y) {
  return nodes.find((node: any) => {
    return (
      x > node.pos.x &&
      node.x + node.pos.width > x &&
      y > node.pos.y &&
      y < node.y + node.pos.height
    );
  });
}

export function getClickedElement(nodes: NodeInstanceDto[], x, y) {
  const isInside = (pos) =>
    x > pos.x && x < pos.x + pos.width && y > pos.y && y < pos.y + pos.height;

  const nodeHits = nodes
    .map((node) => {
      const attributes =
        node.attributes?.filter((att: any) => isInside(att.pos)) ?? [];
      const input = node.inputs?.filter((att: any) => isInside(att.pos)) ?? [];
      const output =
        node.outputs?.filter((att: any) => isInside(att.pos)) ?? [];
      return { attributes, input, output, node };
    })
    .filter(
      (res) => res.attributes.length || res.input.length || res.output.length,
    );

  if (nodeHits.length > 0) {
    if (nodeHits[0].output.length) {
      return {
        type: 'output',
        element: nodeHits[0].output[0],
        node: nodeHits[0].node,
      };
    }
    if (nodeHits[0].input.length) {
      return {
        type: 'input',
        element: nodeHits[0].input[0],
        node: nodeHits[0].node,
      };
    }
    if (nodeHits[0].attributes.length) {
      return {
        type: 'attribute',
        element: nodeHits[0].attributes[0],
        node: nodeHits[0].node,
      };
    }
  }
  return null;
}
