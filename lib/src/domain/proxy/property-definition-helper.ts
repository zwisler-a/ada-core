import { Identifiable } from '../node/identifiable';
import { NodeAttributeProxyDefinition } from './decorator/node-attribute.decorator';
import { NodeState } from '../node/state/node-state';

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
  state: NodeState,
  updateFn: (identifier: string, value: string) => void,
) {
  attributes.forEach((attribute) => {
    const attrState = state.get(attribute.definition.identifier);
    if (attribute.descriptor) {
      const orgSetter = attribute.descriptor.set;
      attribute.descriptor.set = function (value: any) {
        updateFn(attribute.definition.identifier, value);
        orgSetter.bind(instance)(value);
      };
      attribute.descriptor.get = () => attrState.get();
      Object.defineProperty(
        instance,
        attribute.propertyKey,
        attribute.descriptor,
      );
    } else {
      Object.defineProperty(instance, attribute.propertyKey, {
        set(v: any) {
          updateFn(attribute.definition.identifier, v);
        },
        get: () => attrState.get(),
      });
    }
  });
}
