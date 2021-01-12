import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { UnauthorizedExcp } from "src/domain/Exceptions/UnauthorizedExcp";


@Injectable()
export class AuthGuard implements CanActivate
{
    private readonly regex = {
        number: /^[0-9]*$/
    }
    canActivate(context: ExecutionContext) : boolean {
        const req = context.switchToHttp().getRequest();
        if(this.regex.number.test(req.headers.userid))  return true;
        throw new UnauthorizedExcp({code: 'user_unauthorized'});
    }
}