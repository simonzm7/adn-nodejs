import { Module }  from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QueryPaymentsHandler } from 'src/application/Payments/Query/query-appointment-handler';
import { PaymentsController } from './Controllers/payments.controller';
import { PaymentsEntity } from './Entity/payment.entity';
import { DaoPaymentsProvider } from './Providers/dao/dao-payment.provider';
import { RepositoryPaymentsProvider } from './Providers/repository/repository-payments.provider';

@Module({
     imports: [TypeOrmModule.forFeature([PaymentsEntity])],
     controllers: [PaymentsController],
     providers: [QueryPaymentsHandler, DaoPaymentsProvider, RepositoryPaymentsProvider],
     exports: [TypeOrmModule.forFeature([PaymentsEntity]), RepositoryPaymentsProvider]
})
export class PaymentsModule{}
