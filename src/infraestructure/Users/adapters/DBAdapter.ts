import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserModel } from "src/domain/Users/models/UserModel";
import { DBRepository } from "src/domain/Users/repositories/DB/DBRepository";
import { Repository } from "typeorm";
import { User } from "../EntityManager/user.entity";

@Injectable()
export class DBAdapter implements DBRepository {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) { }

    async findOneByEmailAndDni(email: string, dni: string): Promise<User> {
        return await this.userRepository.findOne({
            where: [
                { email },
                { dni }
            ]
        });
    }

    async findOneByEmail(email: string): Promise<User> {
        return await this.userRepository.findOne({ email });
    }
    async findOneById(id: number): Promise<User> {
        return await this.userRepository.findOne({ userId: id });
    }
    async CreateOne(user: UserModel)  : Promise<{}>{
        return new Promise(async (resolve, reject) => {
            await this.userRepository.save({
                email: user.get_email,
                password: user.get_password,
                firstname: user.get_first_name,
                lastname: user.get_last_name,
                dni: user.get_dni,
                balance: 1000000,
                role: user.get_role
            }).then(() => resolve({ statusCode: HttpStatus.OK, message: 'Usuario creado correctamente' }))
                .catch(() => reject({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'No se pudo crear el usuario' }));
        });

    }

    async UpdateBalance(user: User) : Promise<{}> {
        return new Promise(async (resolve, reject) => {
            await this.userRepository.save(user)
            .then(() => resolve({message: 'Balance actulizado', statusCode: HttpStatus.OK}))
            .catch(() => reject({message: 'Error al actualizar el balance', statusCode: HttpStatus.INTERNAL_SERVER_ERROR}))
        })
    }

}