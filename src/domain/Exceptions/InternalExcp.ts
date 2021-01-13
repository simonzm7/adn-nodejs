import { HttpException, HttpStatus } from '@nestjs/common';

export class InternalExcp extends HttpException {
    constructor(message: {}) {
        super({
            message
        }, HttpStatus. INTERNAL_SERVER_ERROR)
    }
}
