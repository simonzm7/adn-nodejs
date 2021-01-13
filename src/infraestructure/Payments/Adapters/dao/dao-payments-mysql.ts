import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DaoPayments } from 'src/domain/Payments/Port/dao/dao-payments';
import { Repository } from 'typeorm';
import { PaymentsEntity } from '../../Entity/payment.entity';


@Injectable()
export class DaoPaymentsMysql implements DaoPayments{
    constructor(@InjectRepository(PaymentsEntity) private readonly paymentRepository: Repository<PaymentsEntity>) { }
    public getPayments = async (idUser: number): Promise<{}[]> => {
        const payments: PaymentsEntity[] = await this.paymentRepository.find({
            select: ['createdAt', 'paymentValue', 'paymentType'],
            where: {idUser}
        });
        const tempPayments: {}[] = [];
        payments.forEach((p: PaymentsEntity) => tempPayments.push({ date: p.createdAt.toLocaleString(), value: p.paymentValue, paymentCode: p.paymentType }));
        return tempPayments;
    };
}
