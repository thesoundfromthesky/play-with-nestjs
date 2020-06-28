import { createDecorator } from './create-decorator';
import { getOption } from '../util';

export const Populate = createDecorator((result, options) => {
  const populate = getOption(options, 'populate', undefined);

  if (populate) {
    return result.populate(populate);
  }
  return result;
});
