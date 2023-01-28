/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EdgeDto } from './EdgeDto';
import type { NodeInstanceDto } from './NodeInstanceDto';

export type NetworkDto = {
    readonly active: boolean;
    identifier: string;
    name: string;
    description: string;
    nodes: Array<NodeInstanceDto>;
    edges: Array<EdgeDto>;
};

