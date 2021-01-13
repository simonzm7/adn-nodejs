import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SuccessExcp } from 'src/domain/Exceptions/SuccessExcp';
import { PaymentModel } from 'src/domain/Payments/Model/Payment';
import { RepositoryPayments } from 'src/domain/Payments/Port/repository/repository-payments';
import { User } from 'src/domain/UserActions/Users/models/User';
import { RepositoryUser } from 'src/domain/UserActions/Users/port/User/repository/repository-user';
import { Repository } from 'typeorm';
import { UserEntity } from '../../Entity/user.entity';


@Injectable()
export class RepositoryUserMysql implements RepositoryUser {

    constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        private readonly repositoryPayments: RepositoryPayments) { }

    public async createOne(user: User) {
        await this.userRepository.save({
            email: user.getEmail,
            password: user.getPassword,
            firstname: user.getFirstName,
            lastname: user.getLastName,
            dni: user.getDni,
            balance: 1000000,
            role: user.getRole
        })
            .then(() => {
                throw new SuccessExcp({ code: 'user_created' });
            });
    }

    public async updateUser(user: UserEntity, idAppointment?: number) {
        await this.userRepository.save(user).catch(async () => {
            if (idAppointment) {
                await this.repositoryPayments.deletePayment(new PaymentModel({
                    idUser: user.userId,
                    idAppointment
                }));
            }
        });
    }
}
