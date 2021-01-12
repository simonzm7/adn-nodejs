import { Appointments } from "src/infraestructure/Appointments/DBEntities/appointment.entity";
import { User } from "src/infraestructure/Users/EntityManager/user.entity";
import { ActionType } from "./Enums/ActionType";

export abstract class AppointmentBussinessLogicRepository {
    public abstract verifyAutoSelect (idUser: number, appointmentId: number);
    public abstract verifyHourDiference(appointments: Appointments[], dateTime: Date);
    public abstract verifyIfDoctorHaveAppointment(idDoctor: number, dateTime: Date);
    public abstract verifyIfCustomerHaveAppointment(userId: number, dateTime: Date);
    public abstract verifyRole(userId: number);
    public abstract verifyDNI(dni: string, weekDay: number);
    public abstract verifyAppointmentStatusAndReturn(idAppointment: number): Promise<Appointments>;
    public abstract verifyAppointmentValidDate(appointmentDate: string, type: ActionType);
    public abstract verifyIfCustomerHaveBalance(userId: number, appointmentCost): Promise<User>;
    public abstract verifyAppointmentByIdsAndReturn(idAppointment: number, userId: number): Promise<Appointments>;
    public abstract verifyAppointmentByIdAndReturn(idAppointment: number): Promise<Appointments>;

}