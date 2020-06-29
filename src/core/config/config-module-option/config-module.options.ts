import { ConfigModuleOptions } from "@nestjs/config/dist/interfaces";
import * as Joi from "@hapi/joi";

import { load } from "./load";

const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid("development", "production", "test", "provision")
    .default("development"),
  PORT: Joi.number().default(8000),
  REDIRECT: Joi.string().required(),
  BASE_URL: Joi.string().required(),
  MONGO_URI: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN_ACCESS_TOKEN: Joi.string().required(),
  JWT_EXPIRES_IN_REFRESH_TOKEN: Joi.string().required(),
  GOOGLE_CLIENT_ID: Joi.string().required(),
  GOOGLE_CLIENT_SECRET: Joi.string().required()
});

const validationOptions = {
  allowUnknown: false,
  abortEarly: true
};

export const configModuleOptions: ConfigModuleOptions = {
  load,
  validationSchema,
  // validationOptions
  //, isGlobal: true,
  // envFilePath: [".development.env"],
  // ignoreEnvFile: true,
  expandVariables: true
};
