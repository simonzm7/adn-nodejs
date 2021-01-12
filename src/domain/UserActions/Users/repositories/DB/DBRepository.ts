import { User } from "src/infraestructure/Users/EntityManager/user.entity";
import { UserModel } from "../../models/UserModel";

export abstract class DBRepository {
    public abstract findOneByEmailAndDni(email : string, dni : string) : Promise<User>;
    public abstract findOneByEmail(email : string) : Promise<User>;
    public abstract findOneByEmailOrId(value : string | number) : Promise<User>;
    public abstract findOneById(id : number);
    public abstract createOne(user : UserModel);
    public abstract updateUser(user : User, idAppointment?: number);
}