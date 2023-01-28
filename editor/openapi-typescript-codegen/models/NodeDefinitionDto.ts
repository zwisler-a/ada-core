/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { NodeAttributeDefinitionDto } from './NodeAttributeDefinitionDto';
import type { NodeInputDefinitionDto } from './NodeInputDefinitionDto';
import type { NodeOutputDefinitionDto } from './NodeOutputDefinitionDto';

export type NodeDefinitionDto = {
    identifier: string;
    name: string;
    description: string;
    inputs: Array<NodeInputDefinitionDto>;
    outputs: Array<NodeOutputDefinitionDto>;
    attributes: Array<NodeAttributeDefinitionDto>;
};

