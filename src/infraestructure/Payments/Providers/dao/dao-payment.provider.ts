import { DaoPayments } from 'src/domain/Payments/Port/dao/dao-payments';
import { DaoPaymentsMysql } from 'src/infraestructure/Payments/Adapters/dao/dao-payments-mysql';


export const DaoPaymentsProvider = {
    provide : DaoPayments,
    useClass: DaoPaymentsMysql
}