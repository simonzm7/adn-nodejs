import { HttpException, HttpStatus } from '@nestjs/common';

export class SuccessExcp extends HttpException {
    constructor(message: {}) {
        super({
            message
        }, HttpStatus.OK)
    }
}