import { Appointment } from 'src/domain/Appointments/Model/Appointment';
import { ActionType } from 'src/domain/Appointments/Enums/ActionType';
import { AppointmentEntity } from 'src/infraestructure/Appointments/Entity/appointment.entity';
import { UserEntity } from 'src/infraestructure/Users/Entity/user.entity';

export abstract class AppointmentRepository {
    public abstract createAppointment(appointment: Appointment);
    public abstract deleteAppointment(appointmentId : number);
    public abstract updateAppointment(appointment: AppointmentEntity, Action: ActionType, user: UserEntity);
}