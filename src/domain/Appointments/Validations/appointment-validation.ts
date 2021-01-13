import { Injectable } from '@nestjs/common';
import { BussinessExcp } from 'src/domain/Exceptions/BussinessExcp';
import { AppointmentEntity } from 'src/infraestructure/Appointments/Entity/appointment.entity';
import { DaoAppointment } from '../port/Appointments/dao/dao-appointments';
import { AppointmentValidationRepository } from '../port/Validations/appointment-validation-repository';


@Injectable()
export class AppointmentValidation implements AppointmentValidationRepository {
    constructor(
        private readonly daoAppointment: DaoAppointment) { }


    verifyAppointmentByParameters = async (parameters: {}[]) => {
        const Appointment: AppointmentEntity = await this.daoAppointment.findAppointmentByParameters(parameters);
        if (!Appointment) {
            throw new BussinessExcp({ code: 'appointment_not_exists' });
        }

        return Promise.resolve(Appointment);
    };

    verifyAppointmentIsAvailable = (appointmentStatus: number) => {
        const APPOINTMENT_CANCELED_STATUS = 2;
        
        if (appointmentStatus === APPOINTMENT_CANCELED_STATUS) {
            throw new BussinessExcp('appointment_already_cancelled');
        }
    };


}
