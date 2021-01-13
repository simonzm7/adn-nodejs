import {UserAuth} from 'src/domain/UserActions/UserAuthentication/Model/UserAuth';

export abstract class CredentialsValidationsRepository {
    public abstract validationPassword (credentials: UserAuth, password: string);
}
