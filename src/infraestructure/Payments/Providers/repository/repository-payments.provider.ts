import { RepositoryPayments } from 'src/domain/Payments/Port/repository/repository-payments';
import { RepositoryPaymentsMysql } from '../../Adapters/repository/repository-payments-mysql';


export const RepositoryPaymentsProvider = {
    provide: RepositoryPayments,
    useClass: RepositoryPaymentsMysql
};
