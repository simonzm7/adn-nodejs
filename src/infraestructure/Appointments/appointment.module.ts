import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { CommandAppointmentCase } from 'src/application/Appointments/UseCases/command/CommandAppointmentCase';
import { QueryAppointmentCase } from 'src/application/Appointments/UseCases/query/QueryAppointmentCase';
import { AppointmentService } from 'src/domain/Appointments/Services/AppointmentCommandService/AppointmentService';
import { AppointmentBussinessLogic } from 'src/domain/Appointments/Validations/AppointmentsBussinessLogic';
import { PaymentsModule } from '../Payments/payments.module';
import { User } from '../Users/EntityManager/user.entity';
import { MergeDB, MergeValidations } from '../Users/MergedProviders/MergeProvider';
import { AppointmentDBAdapter } from './adapters/Command/AppointmentDBAdapter';
import { AppointmentController } from './controllers/appointment.controller';
import { Appointments } from './DBEntities/appointment.entity';
import { MergeAdapter, MergeDBRepository, MergeQueryRepository, MergeAppointmentsValidations } from "./MergeProviders/mergeAppointment";
@Module({
    imports: [TypeOrmModule.forFeature([Appointments]),TypeOrmModule.forFeature([User]), PaymentsModule],
    controllers: [AppointmentController],
    providers: [CommandAppointmentCase,QueryAppointmentCase,AppointmentService,AppointmentBussinessLogic, MergeValidations,
         AppointmentDBAdapter,MergeAppointmentsValidations,MergeAdapter, MergeDBRepository, MergeDB, MergeQueryRepository]
})
export class AppointmentModule {}