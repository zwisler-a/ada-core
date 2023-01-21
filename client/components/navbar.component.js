class NavbarComponent extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
        <nav class="flex gap-8 align-center justify-end">
            <app-profile-username></app-profile-username>
            <app-logout-button></app-logout-button>
        </nav>
        `;
  }
}

window.customElements.define('app-navbar', NavbarComponent);
