import { ValueType } from '../value-types';

export class Mapper {
  mappings: { inKey: any; outKey: any }[];
  map(input: ValueType): ValueType {
    const result: ValueType = {};
    this.mappings.forEach((mapping) => {
      result[mapping.outKey] = input[mapping.inKey];
    });
    return result;
  }
}
