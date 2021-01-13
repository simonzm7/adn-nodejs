import { AppointmentEntity } from 'src/infraestructure/Appointments/Entity/appointment.entity';
import { UserEntity } from 'src/infraestructure/Users/Entity/user.entity';


export abstract class AppointmentRepository {
    public abstract cancelAppointment(appointment: AppointmentEntity, user: UserEntity) 
}
