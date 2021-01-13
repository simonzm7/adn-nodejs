import { Injectable } from '@nestjs/common';
import { PaymentType } from 'src/domain/Payments/Enums/PaymentType';
import { PaymentModel } from 'src/domain/Payments/Model/Payment';
import { RepositoryPayments } from 'src/domain/Payments/Port/repository/repository-payments';
import { UserEntity } from 'src/infraestructure/Users/Entity/user.entity';
import { RepositoryUser } from '../port/User/repository/repository-user';
import { OperationsValidationsRepository } from '../port/Validations/repository/operations-validations-repository';
import { UsersValidationsRepository } from '../port/Validations/repository/user-validations-repository';

@Injectable()
export class BalanceService {
    constructor(
        private readonly userRepository: RepositoryUser,
        private readonly userValidations: UsersValidationsRepository,
        private readonly operatinsValidations: OperationsValidationsRepository,
        private readonly paymentRepository : RepositoryPayments) { }


    public async executeBalance(balance: number, userId) {

        const user: UserEntity = await this.userValidations.userAlreadyExistsAndReturn(userId);
        await this.operatinsValidations.userHaveBalance(Number(balance), Number(user.balance));
        const newBalance : number = this.operatinsValidations.addBalance(balance, user.balance);
        user.balance = newBalance;
        await this.userRepository.updateUser(user);
        await this.paymentRepository.createPayment(new PaymentModel({
            idUser: user.userId,
            idAppointment: -1,
            paymentValue: balance,
            paymentType: PaymentType.RELOAD
        }));
       
    }
}
