import { Injectable } from "@nestjs/common";
import UserAuthModel from "src/domain/UserActions/UserAuthentication/Model/UserAuthModel";
import LoginDTO from "src/domain/UserActions/UserAuthentication/Repository/DTO/LoginDTO";
import UserAuthenticationService from "src/domain/UserActions/UserAuthentication/Service/UserAuthenticationService";
@Injectable()
export default class UserLoginManagement {
    constructor(private readonly userService : UserAuthenticationService){}
    executeLogin = async (credentials : LoginDTO) => {
    await this.userService.executeLogin(new UserAuthModel({
        email: credentials.email,
        password: credentials.password
    }));
    }
}