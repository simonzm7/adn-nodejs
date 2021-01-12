import { Injectable } from "@nestjs/common";
import { BussinessExcp } from "src/domain/Exceptions/BussinessExcp";
import UserAuthModel from "src/domain/UserActions/UserAuthentication/Model/UserAuthModel";
import { DBRepository } from "src/domain/UserActions/Users/repositories/DB/DBRepository";
import { User } from "src/infraestructure/Users/EntityManager/user.entity";
import { UserBussinessLogicRepository } from "../repositories/Users/UserBussinessLogicRepository";


@Injectable()
export class UserBussinessLogic implements UserBussinessLogicRepository{
    constructor(private readonly dbAdapter: DBRepository) { }


    userAlreadyExists = async (email: string, dni: string) => {
        if ((await this.dbAdapter.findOneByEmailAndDni(email, dni)))
            throw new BussinessExcp({ code: 'user_already_exists' });
    }

    userAlreadyExistsAndReturn = async (value: string | number): Promise<User> => {
        const user: User = await this.dbAdapter.findOneByEmailOrId(value);
        if (!user) throw new BussinessExcp({ code: 'email_not_found' });

        return user;
    }
    userHaveBalance = async (balance: number, userBalance: number) => {
        if ((balance + userBalance) > 9000000) {
            const allowedBalance = 9000000 - userBalance;
            if (allowedBalance >= 0)
                throw new BussinessExcp({ code: 'invalid_balance', allowedBalance: allowedBalance });
        }


    }
    validationPassword = (credentials: UserAuthModel, password: string) => {
        if (!(credentials.getPassword === password))
            throw new BussinessExcp({ code: 'invalid_password' });
    }
}