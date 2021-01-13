import { AppointmentValidationRepository } from 'src/domain/Appointments/port/Validations/appointment-validation-repository';
import { DateValidationRepository } from 'src/domain/Appointments/port/Validations/date-validation-repository';
import { UserAppointmentValidationRepository } from 'src/domain/Appointments/port/Validations/user-appointment-validation-repository';
import { AppointmentValidation } from 'src/domain/Appointments/Validations/appointment-validation';
import { DateValidation } from 'src/domain/Appointments/Validations/date-validation';
import { UserAppointmentValidation } from 'src/domain/Appointments/Validations/user-appointment-validation';

export const MergeDateValidations = {
    provide: DateValidationRepository,
    useClass: DateValidation
}

export const MergeAppointmentValidation = {
    provide: AppointmentValidationRepository,
    useClass: AppointmentValidation
}

export const MergeUserAppointmentValidations = {
    provide: UserAppointmentValidationRepository,
    useClass: UserAppointmentValidation
}
