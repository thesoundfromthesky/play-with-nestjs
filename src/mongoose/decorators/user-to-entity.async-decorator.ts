import { createAsyncDecorator } from './create-async-decorator';
import { UserEntity } from '../entities';
import { getOption } from '../util';

export const UserToEntity = createAsyncDecorator(
  (result, options) => {
    const entity = getOption(options, 'entity', true);

    if (entity) {
      return new UserEntity(result);
    }

    return result;
  },
);
