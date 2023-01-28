/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $NodeAttributeDto = {
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
        value: {
            properties: {
            },
            isRequired: true,
        },
    },
} as const;
