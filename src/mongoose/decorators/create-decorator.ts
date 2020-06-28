import { isFunction } from '../util';
import { DecoratorOptions } from '../interfaces';

export function createDecorator(
  fn: (result, options?: DecoratorOptions[]) => unknown,
) {
  return () => (
    target: unknown,
    name: string,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor => {
    const original = descriptor.value;

    if (isFunction(original)) {
      descriptor.value = function(...args) {
        const result = original.apply(this, args);
        return fn(result, args);
      };
    }

    return descriptor;
  };
}
