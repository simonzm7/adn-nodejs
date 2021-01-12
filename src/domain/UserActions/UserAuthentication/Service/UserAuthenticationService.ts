import { Injectable } from "@nestjs/common";
import { User } from "src/infraestructure/Users/EntityManager/user.entity";
import { UserBussinessLogicRepository } from "../../Users/repositories/Users/UserBussinessLogicRepository";
import UserAuthModel from "../Model/UserAuthModel";
import { LoginRepository } from "../Repository/LoginRepository";

@Injectable()
export default class UserAuthenticationService {
    constructor(private readonly loginRepository: LoginRepository,
        private readonly userBussinessLogic: UserBussinessLogicRepository
    ) { }

    executeLogin = async (credentials: UserAuthModel) => {
        const user : User = await this.userBussinessLogic.userAlreadyExistsAndReturn(credentials.getEmail);
        this.userBussinessLogic.validationPassword(credentials, user.password);
        await this.loginRepository.LoginUser(user.userId);
    }
}