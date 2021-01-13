import { AppointmentRepository } from 'src/domain/Appointments/port/Appointments/repository/appointment-repository';
import { RepositoryAppointmentMysql } from '../../adapters/repository/repository-appointment-mysql';


export const RepositoryAppointmentProvider = {
    provide: AppointmentRepository,
    useClass: RepositoryAppointmentMysql
}