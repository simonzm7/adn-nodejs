import { User } from "src/infraestructure/Users/EntityManager/user.entity";
import { UserModel } from "../../models/UserModel";

export abstract class abstractUser
{
    abstract createUser(user : UserModel);
    abstract updateBalance(balance : number, user : User);

}