import { Injectable } from "@nestjs/common";
import { AppointmentModel } from "src/domain/Appointments/Model/AppointmentModel";
import { AppointmentSelectorModel } from "src/domain/Appointments/Model/AppointmentSelectorModel";
import { AppointmentDTO } from "src/domain/Appointments/Repository/DTO/AppointmentDTO";
import { AppointmentSelectorDTo } from "src/domain/Appointments/Repository/DTO/AppointmentSelectorDTO";
import { AppointmentService } from "src/domain/Appointments/Services/AppointmentService";
import { Appointments } from "src/infraestructure/Appointments/DBEntities/appointment.entity";



@Injectable()
export class createAppointmentCase {
    constructor(private readonly appointmentService: AppointmentService) { }

    ExecuteCreate = async (appointment: AppointmentDTO): Promise<{}> => {
        return await this.appointmentService.ExecuteCreate(new AppointmentModel(appointment));
    }

    ExecuteList = async (): Promise<Appointments[]> => {
        return await this.appointmentService.ExecuteList();
    }

    ExecuteSelector = async (dto: AppointmentSelectorDTo): Promise<{}> => {
        return await this.appointmentService.ExecuteSelector(new AppointmentSelectorModel(dto));
    }
    ExecuteCanceller = async (id: number, userId: number): Promise<{}> => {
        return await this.appointmentService.ExecuteCanceller(id, userId);
    }

    ExecuteDeletor = async (appointmentId: number, userId: number) : Promise<{}> => {
        return await this.appointmentService.ExecuteDeletor(appointmentId, userId);
    }
}