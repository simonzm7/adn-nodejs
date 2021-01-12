import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BussinessExcp } from "src/domain/Exceptions/BussinessExcp";
import { PaymentModel } from "src/domain/Payments/Repository/Model/PaymentModel";
import { PaymentsDBRepository } from "src/domain/Payments/Repository/PaymentsDBRepository";
import { getConnection, Repository } from "typeorm";
import { Payments } from "../Entities/payment.entity";

@Injectable()
export class PaymentDBAdapter implements PaymentsDBRepository {
    constructor(@InjectRepository(Payments) private readonly paymentRepository: Repository<Payments>) { }
    public getPayments = async (idUser: number): Promise<{}[]> => {
        const payments: Payments[] = await this.paymentRepository.find({ idUser });
        const tempPayments: {}[] = [];
        payments.forEach((p: Payments) => tempPayments.push({ date: p.createdAt.toLocaleString(), value: p.paymentValue, paymentCode: p.paymentType }))
        return tempPayments;
    }

    public createPayment = async (payment: PaymentModel) => {
        try {
            await this.paymentRepository.save({
                idUser: payment.getIdUser,
                idAppointment: payment.getidAppointment,
                paymentType: payment.getPaymentType,
                paymentValue: payment.getPaymentValue,
                createdAt: new Date().toLocaleString()
            });
        } catch {
            throw new BussinessExcp({ code: 'payment_failed' });
        }
    }

    public deletePayment = async (payment: PaymentModel) => {
        try {
            await getConnection().createQueryBuilder()
                .delete()
                .from(Payments)
                .where('idUser = :idUser', { idUser: payment.getIdUser })
                .andWhere('idAppointment = :idAppointment', { idAppointment: payment.getidAppointment })
                .execute();
        } catch {
            throw new BussinessExcp({ code: 'payment_cancel_failed' });
        }
    }
}