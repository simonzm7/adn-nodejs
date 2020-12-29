import { Injectable } from "@nestjs/common";
import UserAuthModel from "src/domain/UserAuthentication/Model/UserAuthModel";
import LoginDTO from "src/domain/UserAuthentication/Repository/DTO/LoginDTO";
import UserAuthenticationService from "src/domain/UserAuthentication/Service/UserAuthenticationService";
@Injectable()
export default class UserLoginManagement {
    constructor(private readonly userService : UserAuthenticationService){}
    ExecuteLogin = async (credentials : LoginDTO) : Promise<{}> => {
       return await this.userService.ExecuteLogin(new UserAuthModel(credentials));
    }
}