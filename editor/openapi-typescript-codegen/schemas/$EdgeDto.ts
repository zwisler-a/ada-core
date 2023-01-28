/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $EdgeDto = {
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
        inputNodeIdentifier: {
            type: 'string',
            isRequired: true,
        },
        outputNodeIdentifier: {
            type: 'string',
            isRequired: true,
        },
        inputIdentifier: {
            type: 'string',
            isRequired: true,
        },
        outputIdentifier: {
            type: 'string',
            isRequired: true,
        },
    },
} as const;
