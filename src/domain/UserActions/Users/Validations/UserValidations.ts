import { Injectable } from '@nestjs/common';
import { BussinessExcp } from 'src/domain/Exceptions/BussinessExcp';
import { DaoUser } from 'src/domain/UserActions/Users/port/User/dao/dao-user';
import { UserEntity } from 'src/infraestructure/Users/Entity/user.entity';
import { UsersValidationsRepository } from '../port/Validations/repository/user-validations-repository';


@Injectable()
export class UserValidations implements UsersValidationsRepository {
    constructor(private readonly daoUser: DaoUser) { }


    public userAlreadyExists = async (email: string, dni: string) => {
        if ((await this.daoUser.findOneByEmailAndDni(email, dni))) {
            throw new BussinessExcp({ code: 'user_already_exists' });
        }
    };

    public userAlreadyExistsAndReturn = async (value: string | number): Promise<UserEntity> => {
        const user: UserEntity = await this.daoUser.findOneByEmailOrId(value);
        if (!user) { throw new BussinessExcp({ code: 'email_not_found' }); }

        return user;
    };
}
