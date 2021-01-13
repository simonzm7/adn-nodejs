import { HttpException, HttpStatus } from '@nestjs/common';

export class BussinessExcp extends HttpException{
    constructor(message: {}) {
        super({
            message
        }, HttpStatus. BAD_REQUEST)
    }
}