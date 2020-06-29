import { registerAs } from '@nestjs/config';

const Local = registerAs('local', () => ({
  baseUrl: process.env.BASE_URL,
  port: process.env.PORT,
  redirect: process.env.REDIRECT,
}));

const MongoDB = registerAs('mongoDb', () => ({
  host: process.env.MONGO_URI,
}));

const Jwt = registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET,
  expiresInAccessToken: process.env.JWT_EXPIRES_IN_ACCESS_TOKEN,
  expiresInRefreshToken: process.env.JWT_EXPIRES_IN_REFRESH_TOKEN,
}));

const Google = registerAs('google', () => ({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
}));

const Redis = registerAs('redis', () => ({
  url: process.env.REDIS_URL,
}));

export const load = [Local, MongoDB, Jwt, Google, Redis];
