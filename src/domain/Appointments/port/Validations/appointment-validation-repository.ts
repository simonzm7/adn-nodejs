import { AppointmentEntity } from 'src/infraestructure/Appointments/Entity/appointment.entity';

export abstract class AppointmentValidationRepository {
    public abstract verifyAppointmentByParameters(parameters : {}[]) : Promise<AppointmentEntity>;
    public abstract verifyAppointmentIsAvailable(appointmentStatus : number);
}
