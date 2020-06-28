import { User, getUserSchema } from './user.schema';

export const userModelFactory = {
  name: User.name,
  useFactory: getUserSchema,
};
