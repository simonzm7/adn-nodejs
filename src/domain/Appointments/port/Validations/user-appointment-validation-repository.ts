import { AppointmentEntity } from 'src/infraestructure/Appointments/Entity/appointment.entity';
import { UserEntity } from 'src/infraestructure/Users/Entity/user.entity';
import { ActionType } from '../../Enums/ActionType';

export abstract class UserAppointmentValidationRepository {
    public abstract verifyAutoSelect(idUser: number, appointmentId: number);
    public abstract verifyRole(userId: number);
    public abstract verifyDNI(dni: string, weekDay: number);
    public abstract verifyIfCustomerHaveBalance(userId: number, appointmentCost): Promise<UserEntity>;
    public abstract verifyDoctorActionType(appointment: AppointmentEntity, user: UserEntity): ActionType;
    public abstract verifyCustomerActionType(appointment: AppointmentEntity, user: UserEntity): ActionType;
}
