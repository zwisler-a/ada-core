import { BehaviorSubject } from 'rxjs';
import { Camera } from '../renderer/camera';

class CameraStore extends BehaviorSubject<Camera> {
  constructor() {
    super(new Camera());
  }

  updatePositionByDelta(x: number, y: number) {
    this.value.x = this.value.x + x;
    this.value.y = this.value.y + y;
    this.next(this.value);
  }
}

export const cameraStore = new CameraStore();
