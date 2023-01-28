/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { NodeAttributeDto } from './NodeAttributeDto';
import type { NodeInputInstanceDto } from './NodeInputInstanceDto';
import type { NodeOutputInstanceDto } from './NodeOutputInstanceDto';

export type NodeInstanceDto = {
    identifier: string;
    name: string;
    description: string;
    definitionId: string;
    attributes?: Array<NodeAttributeDto>;
    inputs?: Array<NodeInputInstanceDto>;
    outputs?: Array<NodeOutputInstanceDto>;
    'x'?: number;
    'y'?: number;
};

