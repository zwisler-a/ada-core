export const ApiService = {
  fetch: (url, options) => {
    return fetch(url, options).then((res) => res.json());
  },
  getProfile: () => {
    return fetch('/auth/profile').then((res) => res.json());
  },
};
