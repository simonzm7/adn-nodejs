import { Module }  from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommandsPaymentsUseCase } from 'src/application/Payments/Command/CommandsPaymentsUseCase';
import { QueryPaymentsUseCase } from 'src/application/Payments/Query/QueryPaymentsUseCase';
import { PaymentService } from 'src/domain/Payments/Services/PaymentService';
import { PaymentsController } from './Controllers/payments.controller';
import { Payments } from './Entities/payment.entity';
import { PaymentsMerge } from './MergedProviders/MergedProviders';

@Module({
     imports: [TypeOrmModule.forFeature([Payments])],
     controllers: [PaymentsController],
     providers: [QueryPaymentsUseCase, PaymentService, CommandsPaymentsUseCase,PaymentsMerge],
     exports: [TypeOrmModule.forFeature([Payments]), PaymentService, CommandsPaymentsUseCase, PaymentsMerge]
})
export class PaymentsModule{}