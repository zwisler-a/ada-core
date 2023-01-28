import { Component, StatefulComponent } from '../util/component.decorator';
import { networkSelector, networksStore } from '../store/network.store';
import { Notification, notificationStore } from '../store/notification.store';

interface NotificationComponentState {
  notifications: Notification[];
}

const initialState: NotificationComponentState = {
  notifications: [],
};

@Component({
  selector: 'app-notifications',
})
export class NotificationComponent extends StatefulComponent<NotificationComponentState> {
  constructor() {
    super(initialState);
  }

  connectedCallback() {
    this.useStore('notifications', notificationStore);
  }

  render(state: NotificationComponentState) {
    if (!state.notifications?.length) return 'Nope';
    return `
      <div class="notification-container">
        ${state.notifications
          .map(
            (notification) =>
              `<div class="notification ${notification.type}">${notification.content}</div>`,
          )
          .join('')}
      </div>
    `;
  }
}
