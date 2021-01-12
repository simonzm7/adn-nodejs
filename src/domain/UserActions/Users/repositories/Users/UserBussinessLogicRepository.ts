import UserAuthModel from "src/domain/UserActions/UserAuthentication/Model/UserAuthModel";
import { User } from "src/infraestructure/Users/EntityManager/user.entity";


export abstract class UserBussinessLogicRepository {
    public abstract userAlreadyExists(email: string, dni: string);
    public abstract userAlreadyExistsAndReturn(value: string | number): Promise<User>;
    public abstract userHaveBalance(balance: number, userBalance: number);
    public abstract validationPassword(credentials: UserAuthModel, password: string);
}