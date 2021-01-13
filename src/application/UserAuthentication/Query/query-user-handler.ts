import { Injectable } from '@nestjs/common';
import { DaoAuth } from 'src/domain/UserActions/UserAuthentication/port/dao/dao-auth';
import { UserDto } from './DTO/user.dto';



@Injectable()
export class QueryUser {
    constructor(private readonly queryRepositoy : DaoAuth){}

    async executeQuery(userId : string) : Promise<UserDto>{
        return this.queryRepositoy.getUser(Number(userId));
    }
}