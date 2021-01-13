import { DaoAppointment } from 'src/domain/Appointments/port/Appointments/dao/dao-appointments';
import { DaoAppointmentMysql } from '../../adapters/dao/dao-appointment-mysql';

export const DaoAppointmentProvider = {
    provide: DaoAppointment,
    useClass: DaoAppointmentMysql
}
