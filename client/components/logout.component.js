
class ProfileComponent extends HTMLElement {

    constructor() {
        super();
        this.innerHTML = `
            <button>Logout</button>
        `
        this.addEventListener('click', () => {
            window.location = '/auth/logout'
        })
    }

}

window.customElements.define('app-logout-button', ProfileComponent);