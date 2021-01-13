import { Injectable } from '@nestjs/common';
import { AppointmentEntity } from 'src/infraestructure/Appointments/Entity/appointment.entity';
import { UserEntity } from 'src/infraestructure/Users/Entity/user.entity';
import { Appointment } from '../../Model/Appointment';
import { AppointmentSelectorModel } from '../../Model/AppointmentSelectorModel';
import { ActionType } from '../../Enums/ActionType';
import { UsersValidationsRepository } from 'src/domain/UserActions/Users/port/Validations/repository/user-validations-repository';
import { DateValidationRepository } from '../../port/Validations/date-validation-repository';
import { UserAppointmentValidationRepository } from '../../port/Validations/user-appointment-validation-repository';
import { AppointmentValidationRepository } from '../../port/Validations/appointment-validation-repository';
import { AppointmentRepository } from '../../port/Appointments/repository/appointment-repository';


@Injectable()
export class AppointmentService {
    constructor(
        private readonly appointmentDBRepository: AppointmentRepository,
        private readonly userValidations: UsersValidationsRepository,
        private readonly dateValidationRepository: DateValidationRepository,
        private readonly userAppointmentValidation: UserAppointmentValidationRepository,
        private readonly appointmentValidation: AppointmentValidationRepository,
    ) { }

    executeCreate = async (appointment: Appointment) => {
        await this.dateValidationRepository.verifyAppointmentValidDate(appointment.getAppointmentDate, ActionType.Create);
        await this.dateValidationRepository.verifyIfDoctorHaveAppointment(appointment.getDoctorId, appointment.getStructuredDate);
        await this.userAppointmentValidation.verifyRole(appointment.getDoctorId);
        await this.appointmentDBRepository.createAppointment(appointment);
    };

    executeSelector = async (selectorModel: AppointmentSelectorModel) => {

        await this.userAppointmentValidation.verifyAutoSelect(selectorModel.getUserId, selectorModel.getAppointmentId);
        await this.dateValidationRepository.verifyIfCustomerHaveAppointment(selectorModel.getUserId, selectorModel.getAppointmentDate);
        const appointment: AppointmentEntity = await this.appointmentValidation.verifyAppointmentStatusAndReturn(selectorModel.getAppointmentId);

        await this.dateValidationRepository.verifyAppointmentValidDate(appointment.appointmentdate, ActionType.Select);
        const user: UserEntity = await this.userAppointmentValidation.verifyIfCustomerHaveBalance(selectorModel.getUserId, appointment.costappointment);
        this.userAppointmentValidation.verifyDNI(user.dni, selectorModel.getWeekDay);
        appointment.appointmentStatus = 1;
        appointment.idUser = user.userId;
        await this.appointmentDBRepository.updateAppointment(appointment, ActionType.Take, user);
    };
    executeCanceller = async (idAppointment: number, userId: number) => {
        const Appointment: AppointmentEntity = await this.appointmentValidation.verifyAppointmentByIdsAndReturn(idAppointment, userId);
        const user: UserEntity = await this.userValidations.userAlreadyExistsAndReturn(userId);
        this.appointmentValidation.verifyAppointmentIsAvailable(Appointment.appointmentStatus);
        let actionType: ActionType;
        actionType = this.userAppointmentValidation.verifyDoctorActionType(Appointment, user);
        actionType = this.userAppointmentValidation.verifyCustomerActionType(Appointment, user);
        Appointment.appointmentStatus = 2;
        await this.appointmentDBRepository.updateAppointment(Appointment, actionType, user)
    };

    executeDeletor = async (appointmentId: number, userId: number) => {
        await this.userAppointmentValidation.verifyRole(userId);
        await this.appointmentDBRepository.deleteAppointment(appointmentId);
    };

}