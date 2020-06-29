import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  BadRequestException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { Response } from 'express';

@Catch(JsonWebTokenError)
export class JwtExceptionFilter implements ExceptionFilter {
  lookupTableFn: (exception: JsonWebTokenError, res: Response) => void;

  lookupTable(exception: JsonWebTokenError, res: Response): void {
    const lookupTable = {
      JsonWebTokenError: this.responseBadRequest,
      TokenExpiredError: this.responseUnauthorized,
      default: this.responseInternalServerError,
    } as const;

    this.lookupTableFn =
      exception.constructor.name in lookupTable
        ? lookupTable[exception.constructor.name]
        : lookupTable.default;
    this.lookupTableFn(exception, res);
  }

  catch(exception: JsonWebTokenError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    this.lookupTable(exception, response);

    // switch (exception.constructor) {
    //   case JsonWebTokenError:
    //     this.responseBadRequest(exception, response);
    //     break;
    //   case TokenExpiredError:
    //     this.responseUnauthorized(exception, response);
    //     break;
    //   default:
    //     this.responseInternalServerError(exception, response);
    // }
  }

  responseBadRequest(exception: JsonWebTokenError, res: Response): void {
    const error = new BadRequestException(exception.message);
    res.status(error.getStatus()).json(error.getResponse());
  }

  responseUnauthorized(exception: JsonWebTokenError, res: Response): void {
    const error = new UnauthorizedException(exception.message);
    res.status(error.getStatus()).json(error.getResponse());
  }

  responseInternalServerError(
    exception: JsonWebTokenError,
    res: Response,
  ): void {
    const error = new InternalServerErrorException(exception);
    res.status(error.getStatus()).json(error.getResponse());
  }
}
