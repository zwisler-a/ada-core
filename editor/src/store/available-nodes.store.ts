import { Store } from './store';
import { CoreService } from '../../openapi-typescript-codegen';

export const availableNodesStore = new Store(CoreService.getAvailableNodes);
