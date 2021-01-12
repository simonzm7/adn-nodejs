import { Injectable } from "@nestjs/common";
import { SuccessExcp } from "src/domain/Exceptions/SuccessExcp";
import { LoginRepository } from "src/domain/UserActions/UserAuthentication/Repository/LoginRepository";

@Injectable()
export class LoginAdapter implements LoginRepository{
    LoginUser = (userId : number) => {
        throw new SuccessExcp({
            code : 'user_authenticated',
            userId
        });
    }
}