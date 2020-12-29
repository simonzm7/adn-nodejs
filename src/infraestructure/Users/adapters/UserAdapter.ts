import { Injectable } from "@nestjs/common";
import { UserModel } from "src/domain/Users/models/UserModel";
import { abstractUser } from "src/domain/Users/repositories/Users/abstractUser";
import { DBRepository } from "src/domain/Users/repositories/DB/DBRepository";
import { User } from "../EntityManager/user.entity";

@Injectable()
export class UserAdapter implements abstractUser {
    constructor(private readonly dbProvider : DBRepository){}
    async createUser(user : UserModel) : Promise<{}> {
        return await this.dbProvider.CreateOne(user);
    }

    async updateBalance(balance : number, user : User) : Promise<{}>
    {
        user.balance = Number(user.balance) + Number(balance);
        return await this.dbProvider.UpdateBalance(user);
    }

    async findUserByIdAndReturn(userId : number) : Promise<User>
    {
        return await this.dbProvider.findOneById(userId);
    }
}