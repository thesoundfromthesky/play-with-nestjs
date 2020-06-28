import { createDecorator } from './create-decorator';
import { getOption } from '../util';

export const OrFail = createDecorator((result, options) => {
  const orFail = getOption(options, 'orFail', true);

  if (orFail) {
    return result.orFail();
  }

  return result;
});

