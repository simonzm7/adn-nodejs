import { Injectable } from '@nestjs/common';
import { Appointment } from 'src/domain/Appointments/Model/Appointment';
import { AppointmentSelector } from 'src/domain/Appointments/Model/AppointmentSelector';
import { AppointmentService } from 'src/domain/Appointments/Services/AppointmentCommandService/AppointmentService';
import { CommandCreateAppointment } from './command-create-appointment'
import { CommandSelectorAppointment } from './command-selector-appointment';

@Injectable()
export class CommandAppointmentHandler {
    constructor(private readonly appointmentService: AppointmentService) { }

    executeCreate = async (appointment: CommandCreateAppointment) => {
        await this.appointmentService.executeCreate(new Appointment(
            appointment.idDoctor,
            appointment.doctorname,
            appointment.appointmentDate,
            appointment.cost
        ));
    };

    executeSelector = async (dto: CommandSelectorAppointment) => {
        await this.appointmentService.executeSelector(new AppointmentSelector({
            appointmentId : dto.AppointmentId,
            week: dto.week,
            userId: dto.userId
        }));
    };
    executeCanceller = async (id: number, userId: number) => {
        await this.appointmentService.executeCanceller(id, userId);
    };

    executeDeletor = async (appointmentId: number, userId: number) => {
        await this.appointmentService.executeDeletor(appointmentId, userId);
    };
}