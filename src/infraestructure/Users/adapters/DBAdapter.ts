import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CommandsPaymentsUseCase } from "src/application/Payments/Command/CommandsPaymentsUseCase";
import { SuccessExcp } from "src/domain/Exceptions/SuccessExcp";
import { UserModel } from "src/domain/UserActions/Users/models/UserModel";
import { DBRepository } from "src/domain/UserActions/Users/repositories/DB/DBRepository";
import { Repository } from "typeorm";
import { User } from "../EntityManager/user.entity";

@Injectable()
export class DBAdapter implements DBRepository {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly commandsPaymentsUseCase: CommandsPaymentsUseCase) { }

    async findOneByEmailAndDni(email: string, dni: string): Promise<User> {
        return await this.userRepository.findOne({
            where: [
                { email },
                { dni }
            ]
        });
    }
    async findOneByEmailOrId(value: string | number): Promise<User> {
        return await this.userRepository.findOne({
            where: [
                { email: value },
                { userId: value }
            ]
        });
    }
    async findOneByEmail(email: string): Promise<User> {
        return await this.userRepository.findOne({ email });
    }
    async findOneById(id: number): Promise<User> {
        return await this.userRepository.findOne({ userId: id });
    }
    async createOne(user: UserModel) {
        await this.userRepository.save({
            email: user.get_email,
            password: user.get_password,
            firstname: user.get_first_name,
            lastname: user.get_last_name,
            dni: user.get_dni,
            balance: 1000000,
            role: user.get_role
        })
            .then(() => { throw new SuccessExcp({code: 'user_created'}); });
    }

    async updateUser(user: User, idAppointment?: number) {
        await this.userRepository.save(user).catch(async ()=> {
            if(idAppointment) await this.commandsPaymentsUseCase.executeDeletor(user.userId, idAppointment);
        })
    }

}