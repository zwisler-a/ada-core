/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $NodeInputInstanceDto = {
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
            type: 'NodeInputDefinitionDto',
            isRequired: true,
        },
    },
} as const;
