class NavbarComponent extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
        <nav class="flex gap-8 align-center justify-end">
            <a href="/">Home</a>
            <span class="spacer"></span>
            <app-profile-username></app-profile-username>
            <app-logout-button></app-logout-button>
        </nav>
        `;
  }
}

window.customElements.define('app-navbar', NavbarComponent);
