export enum PrimitiveValueType {
    STRING = 'string',
    NUMBER = 'number',
    BOOLEAN = "boolean"
}

export type ValueType = { [key: string]: PrimitiveValueType };
