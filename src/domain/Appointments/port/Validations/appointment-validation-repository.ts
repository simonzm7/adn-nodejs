import { AppointmentEntity } from 'src/infraestructure/Appointments/Entity/appointment.entity';

export abstract class AppointmentValidationRepository {
    public abstract verifyAppointmentByIdsAndReturn(idAppointment: number, userId: number): Promise<AppointmentEntity>;
    public abstract verifyAppointmentByIdAndReturn(idAppointment: number): Promise<AppointmentEntity>;
    public abstract verifyAppointmentStatusAndReturn(idAppointment: number): Promise<AppointmentEntity>;
    public abstract verifyAppointmentIsAvailable(appointmentStatus : number);
}