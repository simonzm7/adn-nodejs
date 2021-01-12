import { Injectable } from "@nestjs/common";
import { AppointmentQueryRepository } from "src/domain/Appointments/Repository/AppointmentQueryRepository";
import { Appointments } from "../../DBEntities/appointment.entity";
import { AppointmentDBAdapter } from "../Command/AppointmentDBAdapter";

@Injectable()
export class AppointmentQueryAdapter implements AppointmentQueryRepository{

    constructor(private readonly appointmentDBAdapter : AppointmentDBAdapter) {}
    public executeAgendaList = async (parameters : []) : Promise<{}[]> => {
        const list : Appointments[] = await this.appointmentDBAdapter.listAppointments(parameters); 
        const tempArray :{}[] = [];
        list.forEach((e : Appointments) => tempArray.push({ date: e.appointmentdate, status: e.appointmentStatus }))
        return tempArray;
    }
}