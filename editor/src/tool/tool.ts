import { getClickedElement } from '../util/util';
import { networkManipulationStore } from '../store/network-manipulation.store';
import { cameraStore } from '../store/camera.store';

export abstract class Tool {
  getSelection(ev: MouseEvent) {
    return getClickedElement(
      networkManipulationStore.getNetwork().nodes,
      cameraStore.getValue().reverseX(ev.offsetX),
      cameraStore.getValue().reverseY(ev.offsetY),
    );
  }

  abstract mouseDown(ev: MouseEvent);

  abstract mouseUp(ev: MouseEvent);

  abstract mouseMove(ev: MouseEvent);
}
