import { createDecorator } from './create-decorator';
import { getOption } from '../util';

export const Select = createDecorator((result, options) => {
  const select = getOption(options, 'select', undefined);

  if (select) {
    return result.select(select);
  }

  return result;
});
