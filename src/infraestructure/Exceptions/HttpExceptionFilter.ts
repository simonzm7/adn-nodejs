import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { AppLogger } from '../Configuration/Logger/AppLogger';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
    constructor(private readonly logger : AppLogger){
        this.logger.setContext(HttpExceptionFilter.name)
    }
    catch(exception : HttpException, host: ArgumentsHost)
    {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        try{
            response.status(exception.getStatus()).json(exception.getResponse());
        }catch{}
    }
}
