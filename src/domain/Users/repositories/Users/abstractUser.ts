import { User } from "src/infraestructure/Users/EntityManager/user.entity";
import { UserModel } from "../../models/UserModel";

export abstract class abstractUser
{
    abstract createUser(user : UserModel) : Promise<{}>;
    abstract updateBalance(balance : number, user : User) : Promise<{}>;
    abstract findUserByIdAndReturn(userId : number) : Promise<User>;
}