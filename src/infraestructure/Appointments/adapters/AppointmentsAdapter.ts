import { HttpStatus, Injectable } from "@nestjs/common";
import { AppointmentModel } from "src/domain/Appointments/Model/AppointmentModel";
import { AppointmentDBRepository } from "src/domain/Appointments/Repository/AppointmentDBRepository";
import { AppointmentRepository } from "src/domain/Appointments/Repository/AppointmentRepository";
import { ActionType } from "src/domain/Appointments/Repository/Enums/ActionType";
import { User } from "src/infraestructure/Users/EntityManager/user.entity";
import { Appointments } from "../DBEntities/appointment.entity";

@Injectable()
export class AppointmentAdapter implements AppointmentRepository {
    constructor(private readonly appoimentDBRepository: AppointmentDBRepository) { }
    createAppointment = async (appointment: AppointmentModel): Promise<{}> => {
        return await this.appoimentDBRepository.createAppointment(appointment);
    }
    listAppointments = async (parameters: {}): Promise<Appointments[]> => {
        return await this.appoimentDBRepository.listAppointments(parameters);
    }
    takeAppointment = async (appointment: Appointments, user: User): Promise<{}> => {
        appointment.appointmentStatus = 1;
        appointment.idUser = user.userId;
        return await this.appoimentDBRepository.putAppointment(appointment, ActionType.Take, user);
    }

    cancelAppointment = async (appointment: Appointments, user: User): Promise<{}> => {
        return new Promise((resolve, reject) => {
            if (appointment.appointmentStatus < 2) {
                appointment.appointmentStatus = 2;
                resolve(this.appoimentDBRepository.putAppointment(appointment, ActionType.Cancel, user));
            }
            else
               reject({message: 'Cita ya cancelada', statusCode: HttpStatus.BAD_REQUEST});
        });
    }
    cancelAppointmentWithoutUser = async (appointment: Appointments): Promise<{}> => {
        return new Promise(async (resolve, reject) => {
            if (appointment.appointmentStatus < 2) {
                appointment.appointmentStatus = 2;
                resolve(this.appoimentDBRepository.putAppointment(appointment, ActionType.Cancel, null));
            }
            else
                reject({ statusCode: HttpStatus.BAD_REQUEST, message: 'Cita ya cancelada' });
        });
    }
    deleteAppointment = async (appointmentId: number) : Promise<{}>=> {
        return await this.appoimentDBRepository.findAppointmentByIdAndDelete(appointmentId);
    }
}