export const ApiService = {
    getProfile: () => {
        return fetch('/auth/profile')
            .then(res => res.json())
    }
}