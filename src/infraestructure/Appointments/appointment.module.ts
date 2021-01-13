import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommandAppointmentHandler } from 'src/application/Appointments/command/command-appointment-handler';
import { QueryAppointmentHandler } from 'src/application/Appointments/query/query-appointment-handler';
import { AppointmentService } from 'src/domain/Appointments/Services/AppointmentCommandService/AppointmentService';
import { PaymentsModule } from '../Payments/payments.module';
import { UserEntity } from '../Users/Entity/user.entity';
import { MergeUserValidations } from '../Users/Providers/Validations/validations.provider';
import { DaoUserProvider } from '../Users/Providers/dao/dao-user.provider';
import { RepositoryUserProvider } from '../Users/Providers/repository/repository-user.provider';
import { AppointmentController } from './controllers/appointment.controller';
import { AppointmentEntity } from './Entity/appointment.entity';
import { DaoAppointmentProvider } from './Providers/dao/dao-appointment.provider';
import { MergeAppointmentValidation, MergeDateValidations, MergeUserAppointmentValidations } from './Providers/Validations/validations.provider';
import { RepositoryAppointmentProvider } from './Providers/repository/repository-appointment.provider';
@Module({
    imports: [TypeOrmModule.forFeature([AppointmentEntity]), TypeOrmModule.forFeature([UserEntity]), PaymentsModule],
    controllers: [AppointmentController],
    providers: [CommandAppointmentHandler, QueryAppointmentHandler, AppointmentService,
        MergeUserAppointmentValidations,
        MergeAppointmentValidation,
        MergeUserValidations,
        MergeDateValidations,
        DaoAppointmentProvider, RepositoryAppointmentProvider, DaoUserProvider, RepositoryUserProvider]
})
export class AppointmentModule { }