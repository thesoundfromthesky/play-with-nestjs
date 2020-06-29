/* eslint-disable @typescript-eslint/no-use-before-define */

import { APP_PIPE } from "@nestjs/core";
import {
  ValidationPipe,
  ValidationError,
  BadRequestException
} from "@nestjs/common";
import { ErrorMessage } from "../interfaces";

export const validationPipeProvider = {
  provide: APP_PIPE,
  useFactory: () => {
    return new ValidationPipe({
      whitelist: true,
      validationError: { target: false },
      skipMissingProperties: true,
      forbidUnknownValues: true,
      // transform:false,
      exceptionFactory(errors: ValidationError[]) {
        return createBadRequestException(errors);
      }
    });
  }
};

function getValidationErrorMessages(errors: ValidationError[]) {
  const messages: ErrorMessage[] = [];
  while (errors.length) {
    const { property, constraints, children } = errors.shift();
    const msg: ErrorMessage = {
      property,
      message: []
    };
    for (const prop in constraints) {
      if (constraints[prop]) {
        msg.message.push(constraints[prop]);
      }
    }
    if (msg.message.length) {
      messages.push(msg);
    }
    if (children) {
      for (const error of children) {
        errors.push(error);
      }
    }
  }
  return messages;
}

function createBadRequestException(
  errors: ValidationError[]
): BadRequestException {
  const messages: ErrorMessage[] = getValidationErrorMessages(errors);
  return new BadRequestException(messages);
}
