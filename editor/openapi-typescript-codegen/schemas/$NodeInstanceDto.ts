/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $NodeInstanceDto = {
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
        definitionId: {
            type: 'string',
            isRequired: true,
        },
        attributes: {
            type: 'array',
            contains: {
                type: 'NodeAttributeDto',
            },
        },
        inputs: {
            type: 'array',
            contains: {
                type: 'NodeInputInstanceDto',
            },
        },
        outputs: {
            type: 'array',
            contains: {
                type: 'NodeOutputInstanceDto',
            },
        },
        'x': {
            type: 'number',
        },
        'y': {
            type: 'number',
        },
    },
} as const;
