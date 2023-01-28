/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $NodeDefinitionDto = {
    properties: {
        identifier: {
            type: 'string',
            isRequired: true,
        },
        name: {
            type: 'string',
            isRequired: true,
        },
        description: {
            type: 'string',
            isRequired: true,
        },
        inputs: {
            type: 'array',
            contains: {
                type: 'NodeInputDefinitionDto',
            },
            isRequired: true,
        },
        outputs: {
            type: 'array',
            contains: {
                type: 'NodeOutputDefinitionDto',
            },
            isRequired: true,
        },
        attributes: {
            type: 'array',
            contains: {
                type: 'NodeAttributeDefinitionDto',
            },
            isRequired: true,
        },
    },
} as const;
