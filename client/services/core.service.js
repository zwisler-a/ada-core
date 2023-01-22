import { ApiService } from './api.service.js';

export const CoreApiService = {
  getAvailableNodes: () => {
    return ApiService.fetch('/core/node/available');
  },
  getNetworks: () => {
    return ApiService.fetch('/core/network');
  },
  createOrSave: (network) => {
    return ApiService.fetch('/core/network', {
      method: 'POST',
      body: JSON.stringify(network),
      headers: { 'Content-Type': 'application/json' },
    });
  },
  deleteNetwork: (id) => {
    return ApiService.fetch('/core/network/' + id, { method: 'DELETE' });
  },
  startNetwork: (id) => {
    return ApiService.fetch('/core/network/start/' + id, { method: 'POST' });
  },
  stopNetwork: (id) => {
    return ApiService.fetch('/core/network/stop/' + id, { method: 'POST' });
  },
};
