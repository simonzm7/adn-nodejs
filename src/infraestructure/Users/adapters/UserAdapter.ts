import { Injectable } from "@nestjs/common";
import { UserModel } from "src/domain/UserActions/Users/models/UserModel";
import { abstractUser } from "src/domain/UserActions/Users/repositories/Users/abstractUser";
import { DBRepository } from "src/domain/UserActions/Users/repositories/DB/DBRepository";
import { User } from "../EntityManager/user.entity";
import { SuccessExcp } from "src/domain/Exceptions/SuccessExcp";
import { PaymentsDBRepository } from "src/domain/Payments/Repository/PaymentsDBRepository";
import { PaymentModel } from "src/domain/Payments/Repository/Model/PaymentModel";
import { PaymentType } from "src/domain/Payments/Repository/Enums/PaymentType";
@Injectable()
export class UserAdapter implements abstractUser {
    constructor(private readonly dbProvider : DBRepository,
        private readonly paymentRepository : PaymentsDBRepository){}

    async createUser(user : UserModel) {
        await this.dbProvider.createOne(user);
    }

    async updateBalance(balance : number, user : User)
    {
        user.balance = Number(user.balance) + Number(balance);
        await this.dbProvider.updateUser(user);
        await this.paymentRepository.createPayment(new PaymentModel({
            idUser: user.userId,
            idAppointment: -1,
            paymentValue: balance,
            paymentType: PaymentType.RELOAD
        }));
        throw new SuccessExcp({code: 'balance_updated'});
    }
}