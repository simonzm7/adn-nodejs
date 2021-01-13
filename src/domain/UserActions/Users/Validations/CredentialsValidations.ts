import { Injectable } from '@nestjs/common';
import { BussinessExcp } from 'src/domain/Exceptions/BussinessExcp';
import { UserAuth } from '../../UserAuthentication/Model/UserAuth';
import { CredentialsValidationsRepository } from '../port/Validations/repository/credentials-validations-repository';


@Injectable()
export class CredentialsValidations implements CredentialsValidationsRepository {
    public validationPassword = (credentials: UserAuth, password: string) => {
        if (!(credentials.getPassword === password)) {
            throw new BussinessExcp({ code: 'invalid_password' });
        }
    };
}
