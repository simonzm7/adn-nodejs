import { Injectable } from "@nestjs/common";
import { AppointmentModel } from "src/domain/Appointments/Model/AppointmentModel";
import { AppointmentSelectorModel } from "src/domain/Appointments/Model/AppointmentSelectorModel";
import { AppointmentDTO } from "src/domain/Appointments/Repository/DTO/AppointmentDTO";
import { AppointmentSelectorDTo } from "src/domain/Appointments/Repository/DTO/AppointmentSelectorDTO";
import { AppointmentService } from "src/domain/Appointments/Services/AppointmentCommandService/AppointmentService";


@Injectable()
export class CommandAppointmentCase {
    constructor(private readonly appointmentService: AppointmentService) { }

    executeCreate = async (appointment: AppointmentDTO) => {
        await this.appointmentService.executeCreate(new AppointmentModel(
            appointment.idDoctor,
            appointment.doctorname,
            appointment.appointmentDate,
            appointment.cost
        ));
    }

    executeSelector = async (dto: AppointmentSelectorDTo) => {
        await this.appointmentService.executeSelector(new AppointmentSelectorModel({
            appointmentId : dto.AppointmentId,
            week: dto.week,
            userId: dto.userId
        }));
    }
    executeCanceller = async (id: number, userId: number) => {
        await this.appointmentService.executeCanceller(id, userId);
    }

    executeDeletor = async (appointmentId: number, userId: number) => {
        await this.appointmentService.executeDeletor(appointmentId, userId);
    }
}