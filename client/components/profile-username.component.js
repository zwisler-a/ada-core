import { ApiService } from "../services/api.service.js";

class ProfileComponent extends HTMLElement {

    constructor() {
        super();
        ApiService.getProfile().then(profile => {
            this.innerText = `${profile.name}`;
        })
    }

}

window.customElements.define('app-profile-username', ProfileComponent);