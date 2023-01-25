import { Identifiable } from '../node/identifiable';
import { NodeAttributeProxyDefinition } from './decorator/node-attribute.decorator';

export function proxyIdentifiable(target: any, instance: Identifiable) {
  Object.defineProperty(target, 'identifier', {
    set: (v: any) => {
      instance.identifier = v;
    },
    get: () => instance.identifier,
  });
  Object.defineProperty(target, 'name', {
    set: (v: any) => {
      instance.name = v;
    },
    get: () => instance.name,
  });
  Object.defineProperty(target, 'description', {
    set: (v: any) => {
      instance.description = v;
    },
    get: () => instance.description,
  });
}

export function proxyAttributeChange(
  instance: any,
  attributes: NodeAttributeProxyDefinition[],
  updateFn: (identifier: string, value: string) => void,
) {
  attributes.forEach((attribute) => {
    let value;
    if (attribute.descriptor) {
      const orgSetter = attribute.descriptor.set;
      attribute.descriptor.set = (value: any) => {
        updateFn(attribute.definition.identifier, value);
        orgSetter(value);
      };
    } else {
      Object.defineProperty(instance, attribute.propertyKey, {
        set(v: any) {
          value = v;
          updateFn(attribute.definition.identifier, v);
        },
        get: () => value,
      });
    }
  });
}
