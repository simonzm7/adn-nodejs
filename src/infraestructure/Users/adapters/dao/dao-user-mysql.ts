import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from 'src/application/UserAuthentication/Query/DTO/user.dto';
import { DaoUser } from 'src/domain/UserActions/Users/port/User/dao/dao-user';
import { Repository } from 'typeorm';
import { UserEntity } from '../../Entity/user.entity';


@Injectable()
export class DaoUserMysql implements DaoUser {
    constructor(@InjectRepository(UserEntity) private readonly userEntity: Repository<UserEntity>) { }

    findOneByEmailAndDni = async(email: string, dni: string): Promise<UserEntity> => {
        return await this.userEntity.findOne({
            where: [
                { email },
                { dni }
            ]
        });
    }
    findOneByEmailOrId = async (value: string | number): Promise<UserEntity> => {
        return await this.userEntity.findOne({
            where: [
                { email: value },
                { userId: value }
            ]
        });
    }
    findOneByEmail = async (email: string): Promise<UserEntity> =>{
        return await this.userEntity.findOne({ email });
    }
    findOneById = async (id: number): Promise<UserEntity> => {
        return await this.userEntity.findOne({ userId: id });
    }

     findAndSelect = async (columns : [], conditions: {}[]) : Promise<UserDto> => {
        return await this.userEntity.findOne({select: columns, where: conditions});
    }
}