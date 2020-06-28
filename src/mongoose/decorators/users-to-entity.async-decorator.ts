import { createAsyncDecorator } from './create-async-decorator';
import { UsersEntity } from '../entities';
import { getOption } from '../util';
export const UsersToEntity = createAsyncDecorator((result, options) => {
  const entities = getOption(options, 'entities', true);

  if (entities) {
    return new UsersEntity(result);
  }

  return result;
});
