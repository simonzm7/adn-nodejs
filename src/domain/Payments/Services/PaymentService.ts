import { Injectable } from "@nestjs/common";
import { PaymentModel } from "../Repository/Model/PaymentModel";
import { PaymentsDBRepository } from "../Repository/PaymentsDBRepository";


@Injectable()
export class PaymentService {

    constructor(private readonly paymentsDBRepository : PaymentsDBRepository) {}
    public executeCreator = async (payment : PaymentModel) => {
        await this.paymentsDBRepository.createPayment(payment);
    }

    public executeDeletor = async (payment : PaymentModel) => {
        await this.paymentsDBRepository.deletePayment(payment);
    }
}