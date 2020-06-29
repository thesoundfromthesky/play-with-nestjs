import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { Error } from 'mongoose';
import { ErrorMessage } from '../../interfaces';
import * as MongooseError from 'mongoose/lib/error/mongooseError';

@Catch(MongooseError)
export class MongooseExceptionFilter implements ExceptionFilter {
  lookupTableFn: (exception: MongooseError, res: Response) => void;

  lookupTable(exception: MongooseError, res: Response): void {
    const lookupTable = {
      [Error.ValidationError.name]: this.responseValidationError,
      [Error.DocumentNotFoundError.name]: this.responseNotFoundError,
      [Error.CastError.name]: this.responseCastError,
      default: this.responseInternalServerError,
    } as const;

    this.lookupTableFn =
      exception.name in lookupTable
        ? lookupTable[exception.name]
        : lookupTable.default;
    this.lookupTableFn(exception, res);
  }

  catch(exception: Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    this.lookupTable(exception, response);

    // switch (exception.name) {
    //   case Error.ValidationError.name: {
    //     this.responseValidationError(
    //       exception as Error.ValidationError,
    //       response,
    //     );
    //     break;
    //   }
    //   case Error.DocumentNotFoundError.name: {
    //     this.responseNotFoundError(
    //       exception as Error.DocumentNotFoundError,
    //       response,
    //     );
    //     break;
    //   }
    //   case Error.CastError.name: {
    //     this.responseCastError(exception as Error.CastError, response);
    //     break;
    //   }
    //   default: {
    //     this.responseInternalServerError(exception, response);
    //   }
    // }
  }

  getValidationErrorMessages(exception: Error.ValidationError): ErrorMessage[] {
    const messages: ErrorMessage[] = [];
    for (const prop in exception.errors) {
      if (exception.errors[prop] && !(exception.errors[prop] as any).errors) {
        const { path, message } = exception.errors[prop];
        messages.push({ property: path, message: [message] });
      }
    }
    return messages;
  }

  getNotFoundErrorMessages(
    exception: Error.DocumentNotFoundError,
  ): ErrorMessage[] {
    const messages: ErrorMessage[] = [];
    const [keys] = Object.keys(exception.query);
    const [property] = keys.split('.').slice(-1);
    const value = exception.query[keys].$eq
      ? exception.query[keys].$eq
      : exception.query[keys];
    messages.push({ property, message: [`${value} not found`] });
    return messages;
  }

  responseValidationError(
    exception: Error.ValidationError,
    res: Response,
  ): void {
    const messages = this.getValidationErrorMessages(exception);
    const error = new BadRequestException(messages);
    res.status(error.getStatus()).json(error.getResponse());
  }

  responseInternalServerError(exception: Error, res: Response): void {
    const error = new InternalServerErrorException(exception);
    res.status(error.getStatus()).json(error.getResponse());
  }

  responseNotFoundError(
    exception: Error.DocumentNotFoundError,
    res: Response,
  ): void {
    const messages = this.getNotFoundErrorMessages(exception);
    const error = new NotFoundException(messages);
    res.status(error.getStatus()).json(error.getResponse());
  }

  responseCastError(exception: Error.CastError, res: Response): void {
    const error = new BadRequestException(exception.message);
    res.status(error.getStatus()).json(error.getResponse());
  }
}
