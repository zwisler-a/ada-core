import { Store } from './store';
import { BehaviorSubject, Observable } from 'rxjs';
import { uuidv4 } from '../util/util';

export interface Notification {
  id?: string;
  content: string;
  type: 'success' | 'error' | 'info';
}

export class NotificationStore extends BehaviorSubject<Notification[]> {
  constructor() {
    super([]);
  }

  display(notification: Notification, duration = 2000) {
    notification.id = uuidv4();
    this.next(this.getValue().concat(notification));
    setTimeout(() => {
      this.next(
        this.getValue().filter((notify) => notify.id !== notification.id),
      );
    }, duration);
    return notification.id;
  }
}

export const notificationStore = new NotificationStore();
