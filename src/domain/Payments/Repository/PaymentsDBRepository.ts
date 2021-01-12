import { PaymentModel } from "./Model/PaymentModel";

export abstract class PaymentsDBRepository{
    public abstract getPayments(idUser : number);
    public abstract createPayment(payment : PaymentModel);
    public abstract deletePayment(payment : PaymentModel);
}