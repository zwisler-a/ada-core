import { getClickedElement, getClickedNode } from '../util/util';
import { networkManipulationStore } from '../store/network-manipulation.store';
import { NodeInstanceDto } from '../../openapi-typescript-codegen';
import { ContextmenuComponent } from '../component/cursor-context-menu.component';
import { NodeDetailsComponent } from '../component/node-details.component';
import { connect } from '../util/drawing-utility';
import { MasterRenderer } from '../renderer/master-rederer';
import { linePadding, rowTextSize } from '../renderer/constants';
import { map, mergeMap, startWith, Subscription, switchMap } from 'rxjs';
import { cameraStore } from '../store/camera.store';

export class CursorTool {
  active = false;

  draggingViewport = false;
  draggingNode: NodeInstanceDto = null;
  draggingOffset = { x: 0, y: 0 };
  private menu: ContextmenuComponent;
  private details: NodeDetailsComponent;

  private connectionStart: any;
  private connectionCurrent = { x: 0, y: 0 };
  private connectionSub: Subscription;

  constructor(
    private canvas: HTMLCanvasElement,
    private container: HTMLElement,
    private masterRenderer: MasterRenderer,
  ) {
    this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
    this.canvas.addEventListener('contextmenu', this.onContextMenu.bind(this));
  }

  onMouseDown(ev: MouseEvent) {
    const clickedNode = this.getNode(ev);
    const selection = this.getElement(ev);
    if (!clickedNode) {
      return (this.draggingViewport = true);
    } else {
      if (this.connectionStart) {
        this.connectionSub.unsubscribe();
        if (selection && selection.type === 'input') {
          networkManipulationStore.addEdge(
            this.connectionStart.element as any,
            selection.element as any,
            this.connectionStart.node as any,
            selection.node as any,
          );
        } else {
          networkManipulationStore.next(networkManipulationStore.getNetwork());
        }
        this.connectionStart = null;
      }

      this.draggingNode = clickedNode;
      this.container.classList.add('cursor-dragging');
      this.draggingOffset = {
        x: ev.offsetX - clickedNode.x,
        y: ev.offsetY - clickedNode.y,
      };
    }
  }

  onMouseMove(ev: MouseEvent) {
    if (this.draggingViewport) {
      cameraStore.updatePositionByDelta(-ev.movementX, -ev.movementY);
    }
    if (this.draggingNode) {
      networkManipulationStore.updateNodePosition(
        this.draggingNode,
        ev.offsetX - this.draggingOffset.x,
        ev.offsetY - this.draggingOffset.y,
      );
    }
    if (this.connectionStart) {
      const el = this.getElement(ev) as any;
      if (el && el.type === 'input') {
        const cam = cameraStore.getValue();
        this.connectionCurrent = {
          x: cam.transX(
            this.connectionStart.element.pos.x > el.element.x
              ? el.element.pos.x + el.element.pos.width
              : el.element.pos.x,
          ),
          y: cam.transY(el.element.pos.y + linePadding / 2 + rowTextSize / 2),
        };
      } else {
        this.connectionCurrent = { x: ev.offsetX, y: ev.offsetY };
      }
      networkManipulationStore.next(networkManipulationStore.getNetwork());
    }
  }

  onMouseUp(ev: MouseEvent) {
    this.draggingNode = null;
    this.container.classList.remove('cursor-dragging');
    this.draggingViewport = false;
  }

  onContextMenu(ev: MouseEvent) {
    const node = this.getNode(ev);
    const el = this.getElement(ev);
    if (node && !el) {
      this.openContextMenuNode(node);
    }
    if (el) {
      this.openContextMenuElement(node, el);
    }
    ev.preventDefault();
  }

  private openContextMenuNode(node: NodeInstanceDto) {
    if (this.menu) {
      document.body.removeChild(this.menu);
    }
    this.menu = document.createElement(
      'app-editor-context-menu',
    ) as ContextmenuComponent;
    this.updateElementPosition(node, this.menu);
    this.menu.setState({
      options: [
        {
          label: 'inspect',
          callback: () => {
            this.openDetails(node);
            this.closeContextMenu();
          },
        },
        {
          label: 'delete',
          callback: () => {
            this.deleteNode(node);
            this.closeContextMenu();
          },
        },
      ],
    });
    document.body.appendChild(this.menu);
  }

  private closeContextMenu() {
    if (this.menu) {
      this.stopElementPosition(this.menu);
      document.body.removeChild(this.menu);
      this.menu = null;
    }
  }

  private deleteNode(node: NodeInstanceDto) {
    networkManipulationStore.deleteNode(node);
  }

  private openDetails(node) {
    if (this.details) {
      document.body.removeChild(this.details);
    }
    this.details = document.createElement(
      'app-node-details',
    ) as NodeDetailsComponent;
    this.details.close = () => this.closeDetail();
    this.updateElementPosition(node, this.details);
    this.details.setAttribute(
      'networkId',
      networkManipulationStore.getNetwork().identifier,
    );
    this.details.setAttribute('nodeId', node.identifier);
    document.body.appendChild(this.details);
  }

  private closeDetail() {
    if (this.details) {
      this.stopElementPosition(this.details);
      document.body.removeChild(this.details);
      this.details = null;
    }
  }

  private getNode(ev: MouseEvent) {
    return getClickedNode(
      networkManipulationStore.getNetwork().nodes,
      cameraStore.getValue().reverseX(ev.offsetX),
      cameraStore.getValue().reverseY(ev.offsetY),
    );
  }

  private getElement(ev: MouseEvent) {
    return getClickedElement(
      networkManipulationStore.getNetwork().nodes,
      cameraStore.getValue().reverseX(ev.offsetX),
      cameraStore.getValue().reverseY(ev.offsetY),
    );
  }

  private updateElementPosition(node, el) {
    el._positionUpdateSubscription = networkManipulationStore
      .pipe(
        startWith(''),
        mergeMap(() => cameraStore),
      )
      .subscribe((cam) => {
        console.log('a');
        const canvasPos = this.canvas.getBoundingClientRect();
        el.style.position = `fixed`;
        el.style.left = `${cam.transX(
          node.pos.x + canvasPos.left + node.pos.width + 10,
        )}px`;
        el.style.top = `${cam.transY(node.pos.y + canvasPos.top)}px`;
      });
  }

  private stopElementPosition(el) {
    if (el._positionUpdateSubscription) {
      el._positionUpdateSubscription.unsubscribe();
    }
  }

  private openContextMenuElement(node, selection: any) {
    if (this.menu) {
      document.body.removeChild(this.menu);
    }
    if (selection.type !== 'output') return;
    this.menu = document.createElement(
      'app-editor-context-menu',
    ) as ContextmenuComponent;
    this.updateElementPosition(node, this.menu);
    this.menu.setState({
      options: [
        {
          label: 'connect',
          callback: () => {
            this.closeContextMenu();
            this.connectionStart = selection;
            this.connectionSub = this.masterRenderer.postProcessManipulations
              .pipe(
                switchMap((ctx) =>
                  cameraStore.pipe(
                    map((camera) => ({
                      camera,
                      ctx,
                    })),
                  ),
                ),
              )
              .subscribe(({ ctx, camera }) => {
                ctx.lineWidth = 2;
                connect(
                  ctx,
                  {
                    x: camera.transX(
                      this.connectionStart.element.pos.x <
                        this.connectionCurrent.x
                        ? this.connectionStart.element.pos.x +
                            this.connectionStart.element.pos.width
                        : this.connectionStart.element.pos.x,
                    ),
                    y: camera.transY(
                      this.connectionStart.element.pos.y +
                        linePadding / 2 +
                        rowTextSize / 2,
                    ),
                  },
                  this.connectionCurrent,
                );
                ctx.lineWidth = 1;
              });
          },
        },
        {
          label: 'clear',
          callback: () => {
            this.closeContextMenu();
            networkManipulationStore.removeEdge(
              selection.node,
              selection.element,
            );
          },
        },
      ],
    });
    document.body.appendChild(this.menu);
  }
}
