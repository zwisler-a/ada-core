/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $NetworkDto = {
    properties: {
        active: {
            type: 'boolean',
            isReadOnly: true,
            isRequired: true,
        },
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
        nodes: {
            type: 'array',
            contains: {
                type: 'NodeInstanceDto',
            },
            isRequired: true,
        },
        edges: {
            type: 'array',
            contains: {
                type: 'EdgeDto',
            },
            isRequired: true,
        },
    },
} as const;
