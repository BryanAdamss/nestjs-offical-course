import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

import { Response } from 'express';

/** 处理HttpException */
@Catch(HttpException)
export class HttpExceptionFilter<
  /** 此处约束下T的类型 */
  T extends HttpException,
> implements ExceptionFilter
{
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    /** 统一下错误信息 */
    const error =
      typeof response === 'string'
        ? { message: exceptionResponse }
        : (exceptionResponse as object);

    /** 原样返回错误 */
    response.status(status).json({
      ...error,
      /** 为了调试，添加个timestamp */
      timeStamp: new Date().toISOString(),
    });
  }
}
