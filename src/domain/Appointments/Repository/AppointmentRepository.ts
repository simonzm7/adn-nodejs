import { Appointments } from "src/infraestructure/Appointments/DBEntities/appointment.entity";
import { User } from "src/infraestructure/Users/EntityManager/user.entity";
import { AppointmentModel } from "../Model/AppointmentModel";


export abstract class AppointmentRepository
{
    abstract createAppointment(appointment : AppointmentModel) : Promise<{}>;
    abstract listAppointments(parameters :{}) : Promise<Appointments[]>;
    abstract takeAppointment(appointment : Appointments, user : User) : Promise<{}>;
    abstract cancelAppointment(appointment : Appointments, user : User) : Promise<{}>;
    abstract cancelAppointmentWithoutUser(appointment : Appointments) : Promise<{}>;
    abstract deleteAppointment(appointmentId : number) : Promise<{}>;
}