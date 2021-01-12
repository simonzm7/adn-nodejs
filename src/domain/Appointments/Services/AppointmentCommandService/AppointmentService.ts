import { Injectable } from "@nestjs/common";
import { Appointments } from "src/infraestructure/Appointments/DBEntities/appointment.entity";
import { User } from "src/infraestructure/Users/EntityManager/user.entity";
import { AppointmentModel } from "../../Model/AppointmentModel";
import { AppointmentSelectorModel } from "../../Model/AppointmentSelectorModel";
import { AppointmentRepository } from "../../Repository/AppointmentRepository";
import { ActionType } from "../../Repository/Enums/ActionType";
import { AppointmentBussinessLogicRepository } from "../../Repository/AppointmentBussinessLogicRepository";
import { UserBussinessLogicRepository } from "src/domain/UserActions/Users/repositories/Users/UserBussinessLogicRepository";


@Injectable()
export class AppointmentService {
    constructor(
        private readonly appointmentRepository: AppointmentRepository,
        private readonly appointmentBussinessLogic: AppointmentBussinessLogicRepository,
        private readonly userBussinessLogic: UserBussinessLogicRepository
    ) { }

    executeCreate = async (appointment: AppointmentModel) => {
        await this.appointmentBussinessLogic.verifyAppointmentValidDate(appointment.getAppointmentDate, ActionType.Create);
        await this.appointmentBussinessLogic.verifyIfDoctorHaveAppointment(appointment.getDoctorId, appointment.getStructuredDate);
        await this.appointmentBussinessLogic.verifyRole(appointment.getDoctorId);
        await this.appointmentRepository.createAppointment(appointment);
    }

    executeSelector = async (selectorModel: AppointmentSelectorModel) => {
        await this.appointmentBussinessLogic.verifyAutoSelect(selectorModel.getUserId, selectorModel.getAppointmentId);
        await this.appointmentBussinessLogic.verifyIfCustomerHaveAppointment(selectorModel.getUserId, selectorModel.getAppointmentDate);
        const appointment: Appointments = await this.appointmentBussinessLogic.verifyAppointmentStatusAndReturn(selectorModel.getAppointmentId);
        await this.appointmentBussinessLogic.verifyAppointmentValidDate(appointment.appointmentdate, ActionType.Select);
        const user: User = await this.appointmentBussinessLogic.verifyIfCustomerHaveBalance(selectorModel.getUserId, appointment.costappointment);
        this.appointmentBussinessLogic.verifyDNI(user.dni, selectorModel.getWeekDay);
        await this.appointmentRepository.takeAppointment(appointment, user);
    }

    executeCanceller = async (idAppointment: number, userId: number) => {
        const Appointment: Appointments | boolean = await this.appointmentBussinessLogic.verifyAppointmentByIdsAndReturn(idAppointment, userId);
        const user: User = await this.userBussinessLogic.userAlreadyExistsAndReturn(userId);
        await this.appointmentRepository.cancelAppointment(Appointment, user)
    }

    executeDeletor = async (appointmentId: number, userId: number) => {
        await this.appointmentBussinessLogic.verifyRole(userId);
        await this.appointmentRepository.deleteAppointment(appointmentId);
    }
}