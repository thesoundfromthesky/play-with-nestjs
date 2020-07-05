import { Auth, getAuthSchema } from './auth.schema';

export const authModelFactory = {
  name: Auth.name,
  useFactory: getAuthSchema,
};
