import { Injectable } from '@nestjs/common';
import { DaoPayments } from 'src/domain/Payments/Port/dao/dao-payments';

@Injectable()
export class QueryPaymentsHandler{

    constructor(private readonly paymentDBRepository : DaoPayments) {}
    public executeQueryUserPayments = async (userId : number) : Promise<{}[]> => {
        return this.paymentDBRepository.getPayments(userId);
    };
}
