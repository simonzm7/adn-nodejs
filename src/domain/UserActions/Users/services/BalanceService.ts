import { Injectable } from "@nestjs/common";
import { User } from "src/infraestructure/Users/EntityManager/user.entity";
import { abstractUser } from "../repositories/Users/abstractUser";
import { UserBussinessLogicRepository } from "../repositories/Users/UserBussinessLogicRepository";
import { UserBussinessLogic } from "../Validations/UserBussinessLogic";

@Injectable()
export class BalanceService {
    constructor(
        private readonly userRepository: abstractUser,
        private readonly userBussinessLogic : UserBussinessLogicRepository) { }

        
    public async executeBalance(balance: number, userId) {

        const user : User = await this.userBussinessLogic.userAlreadyExistsAndReturn(userId);
        await this.userBussinessLogic.userHaveBalance(Number(balance), Number(user.balance));
        await this.userRepository.updateBalance(balance, user);
    }
}