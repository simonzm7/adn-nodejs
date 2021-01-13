import { CredentialsValidationsRepository } from 'src/domain/UserActions/Users/port/Validations/repository/credentials-validations-repository';
import { OperationsValidationsRepository } from 'src/domain/UserActions/Users/port/Validations/repository/operations-validations-repository';
import { UsersValidationsRepository } from 'src/domain/UserActions/Users/port/Validations/repository/user-validations-repository';
import { CredentialsValidations } from 'src/domain/UserActions/Users/Validations/CredentialsValidations';
import { OperationsValidations } from 'src/domain/UserActions/Users/Validations/OperationsValidations';
import { UserValidations } from 'src/domain/UserActions/Users/Validations/UserValidations';


export const MergeCredentialsRepository = {
    provide: CredentialsValidationsRepository,
    useClass: CredentialsValidations
};

export const MergeOperationsRepository = {
    provide: OperationsValidationsRepository,
    useClass: OperationsValidations
};

export const MergeUserValidations = {
    provide: UsersValidationsRepository,
    useClass: UserValidations
};
