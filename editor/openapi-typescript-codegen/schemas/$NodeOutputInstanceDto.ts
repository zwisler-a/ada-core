/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $NodeOutputInstanceDto = {
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
        definition: {
            type: 'NodeOutputDefinitionDto',
            isRequired: true,
        },
    },
} as const;
