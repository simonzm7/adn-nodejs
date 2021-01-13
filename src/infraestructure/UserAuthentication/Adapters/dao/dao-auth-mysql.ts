import { Injectable } from '@nestjs/common';
import { UserDto } from 'src/application/UserAuthentication/Query/DTO/user.dto';
import { DaoUser } from 'src/domain/UserActions/Users/port/User/dao/dao-user';

@Injectable()
export class DaoAuthMysql {
    constructor(private readonly daoUser: DaoUser) { }

    async getUser(userId: number) : Promise<UserDto>{
        return this.daoUser.findAndSelect(['balance', 'firstname', 'lastname', 'role'],
        [{userId}]);
    }
}
