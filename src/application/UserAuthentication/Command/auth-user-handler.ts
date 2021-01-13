import { Injectable } from '@nestjs/common';
import { UserAuth } from 'src/domain/UserActions/UserAuthentication/Model/UserAuth';
import {UserAuthenticationService} from 'src/domain/UserActions/UserAuthentication/Service/UserAuthenticationService';
import AuthCommand from './auth-command';
@Injectable()
export default class AuthUserHandler {
    constructor(private readonly userService: UserAuthenticationService) { }
    executeLogin = async (credentials: AuthCommand) => {
        await this.userService.executeLogin(new UserAuth({
            email: credentials.email,
            password: credentials.password
        }));
    };
}
