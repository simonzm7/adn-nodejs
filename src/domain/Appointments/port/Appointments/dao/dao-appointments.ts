import { AppointmentEntity } from 'src/infraestructure/Appointments/Entity/appointment.entity';


export abstract class DaoAppointment {
    public abstract listAppointments(columns: string[], parameters: {}[]): Promise<{}[]>;
    public abstract findAppointmentByParameters(parameters : {}[]) : Promise<AppointmentEntity>;
}
