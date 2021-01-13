import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BussinessExcp } from 'src/domain/Exceptions/BussinessExcp';
import { PaymentModel } from 'src/domain/Payments/Model/Payment';
import { getConnection, Repository } from 'typeorm';
import { PaymentsEntity } from '../../Entity/payment.entity';


@Injectable()
export class RepositoryPaymentsMysql {
    constructor(@InjectRepository(PaymentsEntity) private readonly paymentRepository: Repository<PaymentsEntity>) { }
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
                .from(PaymentsEntity)
                .where('idUser = :idUser', { idUser: payment.getIdUser })
                .andWhere('idAppointment = :idAppointment', { idAppointment: payment.getidAppointment })
                .execute();
        } catch {
            throw new BussinessExcp({ code: 'payment_cancel_failed' });
        }
    }
}