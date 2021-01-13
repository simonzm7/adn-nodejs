import { UserDto } from 'src/application/UserAuthentication/Query/DTO/user.dto';
import { UserEntity } from 'src/infraestructure/Users/Entity/user.entity';

export abstract class DaoUser {
    public abstract findOneByEmailAndDni(email : string, dni : string) : Promise<UserEntity>;
    public abstract findOneByEmail(email : string) : Promise<UserEntity>;
    public abstract findOneByEmailOrId(value : string | number) : Promise<UserEntity>;
    public abstract findOneById(id : number);
    public abstract findAndSelect(columns: string[], conditions : {}[]) : Promise<UserDto>;
}