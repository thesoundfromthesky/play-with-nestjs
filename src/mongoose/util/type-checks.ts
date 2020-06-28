export function isObject(object: Record<string, unknown>): boolean {
  return object && typeof object === 'object' && object.constructor === Object;
}

export function isFunction(fn: () => unknown): boolean {
  return typeof fn === 'function';
}
