import { HttpException, HttpStatus } from '@nestjs/common';

export class UnauthorizedExcp extends HttpException {
    constructor(message: {}) {
        super({
            message
        }, HttpStatus.UNAUTHORIZED)
    }
}
