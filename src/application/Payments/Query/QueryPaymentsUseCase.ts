import { Injectable } from "@nestjs/common";
import { PaymentsDBRepository } from "src/domain/Payments/Repository/PaymentsDBRepository";



@Injectable()
export class QueryPaymentsUseCase{

    constructor(private readonly paymentDBRepository : PaymentsDBRepository) {}
    public executeQueryUserPayments = async (userId : number) => {
        return await this.paymentDBRepository.getPayments(userId);
    }
}