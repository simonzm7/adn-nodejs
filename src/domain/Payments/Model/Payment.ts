import { PaymentType } from '../Enums/PaymentType';

interface IPayment {
    idUser: number;
    paymentValue?: number;
    idAppointment?: number;
    paymentType?: PaymentType;
}
export class PaymentModel {
    private readonly idUser: number;
    private readonly paymentValue: number;
    private readonly idAppointment: number;
    private readonly paymentType: PaymentType;
    constructor({ idUser, paymentValue, idAppointment, paymentType }: IPayment) {
        this.idUser = idUser;
        this.paymentValue = paymentValue;
        this.idAppointment = idAppointment;
        this.paymentType = paymentType;
    }


    get getIdUser(): number {
        return this.idUser;
    }
    get getidAppointment(): number {
        return this.idAppointment;
    }
    get getPaymentValue(): number {
        return this.paymentValue;
    }

    get getPaymentType(): PaymentType {
        return this.paymentType;
    }
}