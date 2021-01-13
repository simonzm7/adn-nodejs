import { UserDto } from 'src/application/UserAuthentication/Query/DTO/user.dto';

export abstract class DaoAuth {
    public abstract getUser(userId : number) : Promise<UserDto>;
}