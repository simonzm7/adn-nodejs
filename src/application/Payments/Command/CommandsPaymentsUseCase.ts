import { Injectable } from "@nestjs/common";
import { PaymentType } from "src/domain/Payments/Repository/Enums/PaymentType";
import { PaymentModel } from "src/domain/Payments/Repository/Model/PaymentModel";
import { PaymentService } from "src/domain/Payments/Services/PaymentService";



interface ICreator {
    idUser: number;
    paymentValue: number;
    idAppointment: number;
    paymentType: PaymentType;
}
@Injectable()
export class CommandsPaymentsUseCase {

    constructor(private readonly paymentService: PaymentService) { }
    public executeCreator = async (obj: ICreator) => {
        await this.paymentService.executeCreator(new PaymentModel(obj));
    }

    public executeDeletor = async (idUser: number, idAppointment: number) => {
        await this.paymentService.executeDeletor(new PaymentModel({
            idUser,
            idAppointment
        }));
    }
}