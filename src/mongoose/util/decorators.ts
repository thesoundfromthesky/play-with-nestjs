import { QueryOptions } from '../interfaces';
import { lastIndex } from './array-helpers';

export function getOption(
  options: QueryOptions[],
  name: string,
  value: unknown,
): QueryOptions {
  const last = lastIndex(options);
  let option = value;

  if (last > -1 && options[last]) {
    option = options[last].hasOwnProperty(name)
      ? options[last]
      : { [name]: value };

    return option[name];
  }

  return option;
}
