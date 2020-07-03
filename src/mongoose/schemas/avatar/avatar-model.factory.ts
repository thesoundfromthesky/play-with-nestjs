import { Avatar, getAvatarSchema } from './avatar.schema';

export const avatarModelFactory = {
  name: Avatar.name,
  useFactory: getAvatarSchema,
};
