import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from 'src/application/UserAuthentication/Query/DTO/user.dto';
import { DaoUser } from 'src/domain/UserActions/Users/port/User/dao/dao-user';
import { Repository } from 'typeorm';
import { UserEntity } from '../../Entity/user.entity';


@Injectable()
export class DaoUserMysql implements DaoUser {
    constructor(@InjectRepository(UserEntity) private readonly userEntity: Repository<UserEntity>) { }

    public findOneByEmailAndDni = async(email: string, dni: string): Promise<UserEntity> => {
        return this.userEntity.findOne({
            where: [
                { email },
                { dni }
            ]
        });
    };
    public findOneByEmailOrId = async (value: string | number): Promise<UserEntity> => {
        return this.userEntity.findOne({
            where: [
                { email: value },
                { userId: value }
            ]
        });
    };
    public findOneByEmail = async (email: string): Promise<UserEntity> =>{
        return this.userEntity.findOne({ email });
    };
    public findOneById = async (id: number): Promise<UserEntity> => {
        return this.userEntity.findOne({ userId: id });
    };

    public findAndSelect = async (columns : [], conditions: {}[]) : Promise<UserDto> => {
        return this.userEntity.findOne({select: columns, where: conditions});
    };
}
