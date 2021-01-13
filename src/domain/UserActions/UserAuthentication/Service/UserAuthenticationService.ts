import { Injectable } from '@nestjs/common';
import { SuccessExcp } from 'src/domain/Exceptions/SuccessExcp';
import { UserEntity } from 'src/infraestructure/Users/Entity/user.entity';
import { CredentialsValidationsRepository } from '../../Users/port/Validations/repository/credentials-validations-repository';
import { UsersValidationsRepository } from '../../Users/port/Validations/repository/user-validations-repository';
import { UserAuth } from '../Model/UserAuth';

@Injectable()
export class UserAuthenticationService {
    constructor(
        private readonly userValidations: UsersValidationsRepository,
        private readonly credentialsValidations: CredentialsValidationsRepository
    ) { }

    executeLogin = async (credentials: UserAuth) => {
        const user: UserEntity = await this.userValidations.userAlreadyExistsAndReturn(credentials.getEmail);
        this.credentialsValidations.validationPassword(credentials, user.password);
        throw new SuccessExcp({
            code: 'user_authenticated',
            userid: user.userId
        });
    }
}