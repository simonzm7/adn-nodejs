import { Injectable } from '@nestjs/common';
import { DaoAppointment } from 'src/domain/Appointments/port/Appointments/dao/dao-appointments';
@Injectable()
export class QueryAppointmentHandler{
    constructor(private readonly daoAppointment : DaoAppointment) {}

    executeList = async (parameters : {}[] = [{
            idUser: -1,
            appointmentStatus: 0
    }]): Promise<{}[]> => {
        return this.daoAppointment.listAppointments(['idAppointment', 'appointmentdate', 'doctorname', 'costappointment'], parameters);
    };

    executeMyList = async (parameters: {}[]) : Promise<{}[]> => {
        return this.daoAppointment.listAppointments(['idAppointment', 'appointmentdate', 'doctorname', 'costappointment', 'appointmentStatus'],parameters);
    };

    executeAgendaList = async (parameters: {}[]) : Promise<{}[]> => {
        return this.daoAppointment.listAppointments(['appointmentdate', 'appointmentStatus'],parameters);
    };
}
