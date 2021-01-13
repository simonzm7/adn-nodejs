import { UserEntity } from 'src/infraestructure/Users/Entity/user.entity';

export abstract class UsersValidationsRepository{
    public abstract userAlreadyExists(email: string, dni: string);
    public abstract userAlreadyExistsAndReturn(value: string | number): Promise<UserEntity>;
}
