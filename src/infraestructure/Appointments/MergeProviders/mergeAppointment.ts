import { AppointmentBussinessLogicRepository } from "src/domain/Appointments/Repository/AppointmentBussinessLogicRepository";
import { AppointmentDBRepository } from "src/domain/Appointments/Repository/AppointmentDBRepository";
import { AppointmentQueryRepository } from "src/domain/Appointments/Repository/AppointmentQueryRepository";
import { AppointmentRepository } from "src/domain/Appointments/Repository/AppointmentRepository";
import { AppointmentBussinessLogic } from "src/domain/Appointments/Validations/AppointmentsBussinessLogic";
import { AppointmentDBAdapter } from "../adapters/Command/AppointmentDBAdapter";
import { AppointmentAdapter } from "../adapters/Command/AppointmentsAdapter";
import { AppointmentQueryAdapter } from "../adapters/Query/AppointmentQueryAdapter";


export const MergeAdapter = {
    provide: AppointmentRepository,
    useClass: AppointmentAdapter
}

export const MergeDBRepository = {
    provide: AppointmentDBRepository,
    useClass: AppointmentDBAdapter
}

export const MergeQueryRepository = {
    provide: AppointmentQueryRepository,
    useClass: AppointmentQueryAdapter

}

export const MergeAppointmentsValidations = {
    provide: AppointmentBussinessLogicRepository,
    useClass: AppointmentBussinessLogic
}