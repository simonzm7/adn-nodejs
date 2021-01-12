import { Injectable } from "@nestjs/common";
import { AppointmentModel } from "src/domain/Appointments/Model/AppointmentModel";
import { AppointmentDBRepository } from "src/domain/Appointments/Repository/AppointmentDBRepository";
import { AppointmentRepository } from "src/domain/Appointments/Repository/AppointmentRepository";
import { ActionType } from "src/domain/Appointments/Repository/Enums/ActionType";
import { Roles } from "src/domain/Appointments/Repository/Enums/Roles";
import { BussinessExcp } from "src/domain/Exceptions/BussinessExcp";
import { SuccessExcp } from "src/domain/Exceptions/SuccessExcp";
import { User } from "src/infraestructure/Users/EntityManager/user.entity";
import { Appointments } from "../../DBEntities/appointment.entity";

@Injectable()
export class AppointmentAdapter implements AppointmentRepository {
    constructor(private readonly appoimentDBRepository: AppointmentDBRepository) { }
    createAppointment = async (appointment: AppointmentModel) => {
        await this.appoimentDBRepository.createAppointment(appointment);
    }
    listAppointments = async (parameters: []): Promise<Appointments[]> => {
        return await this.appoimentDBRepository.listAppointments(parameters);
    }
    takeAppointment = async (appointment: Appointments, user: User) => {
        appointment.appointmentStatus = 1;
        appointment.idUser = user.userId;
        await this.appoimentDBRepository.putAppointment(appointment, ActionType.Take, user);
    }

    cancelAppointment = async (appointment: Appointments, user: User) => {
        if (user.role === Roles.Doctor) {
            if (!(appointment.appointmentStatus < 2))
                throw new BussinessExcp('appointment_already_cancelled');

            appointment.appointmentStatus = 2;
            if (appointment.idUser === -1) {
                await this.appoimentDBRepository.putAppointment(appointment, ActionType.Cancel, user);
            } else {
                await this.appoimentDBRepository.putAppointment(appointment, ActionType.CancelAndReturn, user);
            }
        }
        else {
            if (!(appointment.idUser === user.userId))
                throw new BussinessExcp('invalid_permisons');

            if (!(appointment.appointmentStatus < 2))
                throw new BussinessExcp('appointment_already_cancelled');

            appointment.appointmentStatus = 2;
            await this.appoimentDBRepository.putAppointment(appointment, ActionType.CancelAndReturn, user);

        }
    }
    deleteAppointment = async (appointmentId: number) => {
        await this.appoimentDBRepository.findAppointmentByIdAndDelete(appointmentId);
        throw new SuccessExcp('appointment_deleted');
        
    }
}