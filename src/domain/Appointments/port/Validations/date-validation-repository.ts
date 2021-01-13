import { AppointmentEntity } from 'src/infraestructure/Appointments/Entity/appointment.entity';
import { ActionType } from '../../Enums/ActionType';

export abstract class DateValidationRepository {
    public abstract verifyAppointmentValidDate(appointmentDate: string, type: ActionType);
    public abstract verifyHourDiference(appointments: AppointmentEntity[], dateTime: Date);
    public abstract verifyIfDoctorHaveAppointment(idDoctor: number, dateTime: Date);
    public abstract verifyIfCustomerHaveAppointment(userId: number, dateTime: Date);
}
