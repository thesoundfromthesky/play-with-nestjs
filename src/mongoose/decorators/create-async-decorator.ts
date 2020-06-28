import { isFunction } from '../util';
import { AsyncDecoratorOptions } from '../interfaces';

export function createAsyncDecorator(
  fn: (result, options?: AsyncDecoratorOptions[]) => unknown,
) {
  return () => (
    target: unknown,
    name: string,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor => {
    const original = descriptor.value;

    if (isFunction(original)) {
      descriptor.value = async function(...args) {
        const result = await original.apply(this, args);
        return fn(result, args);
      };
    }

    return descriptor;
  };
}
