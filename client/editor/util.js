export function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16),
  );
}

export function displayNotification(text, duration) {
  const notification = document.createElement('div');
  notification.classList.add('notification');
  notification.innerHTML = `${text}`;
  document.body.appendChild(notification);
  setTimeout(() => {
    document.body.removeChild(notification);
  }, duration);
}
