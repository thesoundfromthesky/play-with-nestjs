export function selectFirst(value: unknown[]): unknown[] {
  if (Array.isArray(value)) {
    return value.slice(0, 1);
  }
  return [value];
}
