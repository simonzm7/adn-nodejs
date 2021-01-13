import { PaymentModel } from '../../Model/Payment';


export abstract class RepositoryPayments {
    public abstract createPayment(payment: PaymentModel);
    public abstract deletePayment(payment: PaymentModel);
}