export enum PrimitiveValueType {
  STRING = 'string',
  NUMBER = 'number',
}

export type ValueType = { [key: string]: PrimitiveValueType };
