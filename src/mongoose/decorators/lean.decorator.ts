import { createDecorator } from './create-decorator';
import { getOption } from '../util';

export const Lean = createDecorator((result, options) => {
  const lean = getOption(options, 'lean', true);
  // let lean = true;
  // if (isObject(options[last])) {
  //   ({ lean } = 'lean' in options[last] ? options[last] : { lean });
  // }
  if (lean) {
    return result.lean({ virtuals: true, getters: true, defaults: true });
  }
  
  return result;
});
