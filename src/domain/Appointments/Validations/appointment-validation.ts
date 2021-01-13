import { Injectable } from '@nestjs/common';
import { BussinessExcp } from 'src/domain/Exceptions/BussinessExcp';
import { AppointmentEntity } from 'src/infraestructure/Appointments/Entity/appointment.entity';
import { DaoAppointment } from '../port/Appointments/dao/dao-appointments';
import { AppointmentValidationRepository } from '../port/Validations/appointment-validation-repository';


@Injectable()
export class AppointmentValidation implements AppointmentValidationRepository {
    constructor(
        private readonly daoAppointment: DaoAppointment) { }


    verifyAppointmentStatusAndReturn = async (idAppointment: number): Promise<AppointmentEntity> => {
        const Appointment: AppointmentEntity = await this.daoAppointment.findAppointmentByIdAndStatus(idAppointment);
        if (!Appointment)
            throw new BussinessExcp({ code: 'appointment_not_exists' });
        return Promise.resolve(Appointment);
    }


    verifyAppointmentByIdsAndReturn = async (idAppointment: number, userId: number): Promise<AppointmentEntity> => {
        const Appointment: AppointmentEntity = await this.daoAppointment.findAppointmentByIds(idAppointment, userId);
        if (!Appointment) throw new BussinessExcp({ code: 'appointment_not_exists' });

        return Promise.resolve(Appointment);
    }
    verifyAppointmentByIdAndReturn = async (idAppointment: number): Promise<AppointmentEntity> => {
        const Appointment: AppointmentEntity = await this.daoAppointment.findAppointmentById(idAppointment);
        if (!Appointment) throw new BussinessExcp({ code: 'appointment_not_exists' });

        return Promise.resolve(Appointment);
    }

    verifyAppointmentIsAvailable = (appointmentStatus: number) => {
        if (!(appointmentStatus < 2))
            throw new BussinessExcp('appointment_already_cancelled');
    }
}