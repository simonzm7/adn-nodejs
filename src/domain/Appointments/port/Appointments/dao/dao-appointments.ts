import { AppointmentEntity } from 'src/infraestructure/Appointments/Entity/appointment.entity';


export abstract class DaoAppointment {
    public abstract listAppointments(columns: string[], parameters: {}[]): Promise<{}[]>;
    public abstract findAppointmentByIdAndStatus(idAppointment: number): Promise<AppointmentEntity>;
    public abstract findAppointmentByIds(idAppointment: number, idUser: number): Promise<AppointmentEntity>;
    public abstract findAppointmentById(idAppointment: number): Promise<AppointmentEntity>;
}