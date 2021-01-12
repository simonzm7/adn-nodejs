import { Injectable } from "@nestjs/common";
import { AppointmentQueryRepository } from "src/domain/Appointments/Repository/AppointmentQueryRepository";
import { AppointmentRepository } from "src/domain/Appointments/Repository/AppointmentRepository";
import { Appointments } from "src/infraestructure/Appointments/DBEntities/appointment.entity";
@Injectable()
export class QueryAppointmentCase{
    constructor(private readonly appointmentRepository : AppointmentRepository,
        private readonly appointmentQueryService : AppointmentQueryRepository) {}

    executeList = async (parameters : {}[] = [{
            idUser: -1,
            appointmentStatus: 0
    }]): Promise<Appointments[]> => {
        return await this.appointmentRepository.listAppointments(parameters);
    }

    executeMyList = async (parameters: {}[]) : Promise<{}[]> => {
        return await this.appointmentRepository.listAppointments(parameters);
    }

    executeAgendaList = async (parameters: {}[]) : Promise<{}[]> => {
        return await this.appointmentQueryService.executeAgendaList(parameters);
    }
}