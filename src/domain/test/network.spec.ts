import { Attribute, Input, Node, Output, ProxyHelper } from '../proxy';
import { Edge } from '../node/edge';
import { DataHolder } from '../node/data-holder';
import { Network } from '../node/network';
import { NodeState } from '../node/state/node-state';

describe('Flip Flop Network', () => {
  jest.useFakeTimers();

  @Node({ name: 'Inverter' })
  class InverterNode {
    @Input({ name: 'in' })
    in(data) {
      this.out(!data);
    }

    @Output({ name: 'out' })
    out: (data: DataHolder) => void;
  }

  @Node({ name: 'Inverter' })
  class IdentityNode {
    @Attribute({ name: 'name', identifier: 'name' })
    name: string;

    @Attribute({ name: 'value', identifier: 'value' })
    value: string;

    @Input({ name: 'in' })
    in(data) {
      this.value = data;
      console.log(`[${this.name}] Value: ${this.value}`);
      this.out(data);
    }

    @Output({ name: 'out' })
    out: (data: DataHolder) => void;
  }

  const inverterDef = ProxyHelper.create(InverterNode);
  const identityDef = ProxyHelper.create(IdentityNode);

  /**  X = InverterNode, O = Noop Node
   * ---------------------------------------
   *                          Caries 1
   *     O----- X ----------- O
   * Out/Reset  |             |
   *            |             |
   *            |             |
   *            |             |        in
   *            O-------------X ------- o
   *      Carries 0
   *
   **/
  it('should', async () => {
    const into = await identityDef.createInstance(new NodeState());
    const out = await identityDef.createInstance(new NodeState());
    const blNoop = await identityDef.createInstance(new NodeState());
    const trNoop = await identityDef.createInstance(new NodeState());
    const tlInv = await inverterDef.createInstance(new NodeState());
    const brInv = await inverterDef.createInstance(new NodeState());

    const edges = [
      new Edge(brInv.outputs[0], into.inputs[0]),
      new Edge(trNoop.outputs[0], brInv.inputs[0]),
      new Edge(tlInv.outputs[0], trNoop.inputs[0]),
      new Edge(blNoop.outputs[0], tlInv.inputs[0]),
      new Edge(brInv.outputs[0], blNoop.inputs[0]),
      new Edge(tlInv.outputs[0], out.inputs[0]),
      new Edge(out.outputs[0], tlInv.inputs[0]),
    ];

    const network = new Network(
      [into, out, blNoop, blNoop, trNoop, tlInv],
      edges,
    );

    network.start();
    (() => {
      into.inputs[0].receive(0);
    })();

    //expect(trNoop.getAttribute('value')).toBe(1);
    //expect(blNoop.getAttribute('value')).toBe(0);
  });
});
