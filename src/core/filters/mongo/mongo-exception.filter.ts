import {
  ArgumentsHost,
  Catch,
  ConflictException,
  ExceptionFilter,
  InternalServerErrorException,
} from '@nestjs/common';
import { Response } from 'express';
import { MongoError } from 'mongodb';
import { ErrorMessage } from '../../interfaces';

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  lookupTableFn: (exception: MongoError, res: Response) => void;

  lookupTable(exception: MongoError, res: Response): void {
    const lookupTable = {
      11000: this.responseE11000Error,
      default: this.responseInternalServerError,
    } as const;

    this.lookupTableFn =
      exception.code in lookupTable
        ? lookupTable[exception.code]
        : lookupTable.default;
    this.lookupTableFn(exception, res);
  }

  catch(exception: MongoError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    this.lookupTable(exception, response);

    // switch (exception.code) {
    //   case 11000: {
    //     this.responseE11000Error(exception, response);
    //     break;
    //   }
    //   default: {
    //     this.responseInternalServerError(exception, response);
    //   }
    // }
  }

  getE11000ErrorMessages(exception: MongoError): ErrorMessage[] {
    const messages: ErrorMessage[] = [];
    const propertyRegex = /(?<=\$).*(?=_)/i;
    const messageRegex = /(?<=\E11000\s).*(?=\sindex)/i;
    const [property] = exception.errmsg.match(propertyRegex);
    const [message] = exception.errmsg.match(messageRegex);
    messages.push({
      property,
      message: [`${property} is already in use (${message})`],
    });
    return messages;
  }

  responseE11000Error(exception: MongoError, res: Response): void {
    const messages = this.getE11000ErrorMessages(exception);
    const error = new ConflictException(messages);
    res.status(error.getStatus()).json(error.getResponse());
  }

  responseInternalServerError(exception: MongoError, res: Response): void {
    const error = new InternalServerErrorException(exception);
    res.status(error.getStatus()).json(error.getResponse());
  }
}
