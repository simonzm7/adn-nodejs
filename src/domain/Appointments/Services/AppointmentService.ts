import { HttpStatus, Injectable } from "@nestjs/common";
import { DBRepository } from "src/domain/Users/repositories/DB/DBRepository";
import { Appointments } from "src/infraestructure/Appointments/DBEntities/appointment.entity";
import { User } from "src/infraestructure/Users/EntityManager/user.entity";
import { AppointmentModel } from "../Model/AppointmentModel";
import { AppointmentSelectorModel } from "../Model/AppointmentSelectorModel";
import { AppointmentRepository } from "../Repository/AppointmentRepository";
import { AppointmentValidationRepository } from "../Repository/AppointmentValidationRepository";


@Injectable()
export class AppointmentService {
    constructor(
        private readonly appointmentRepository: AppointmentRepository,
        private readonly verifyAppointment: AppointmentValidationRepository,
        private readonly userRepository: DBRepository
    ) { }

    ExecuteCreate = async (appointment: AppointmentModel): Promise<{}> => {
        return new Promise(async (resolve, reject) => {
            if (appointment.getErrors.length > 0)
                reject({ message: appointment.getErrors, statusCode: HttpStatus.BAD_REQUEST });
            else {
                if (!(await this.verifyAppointment.VerifyIfDoctorHaveAppointment(appointment.getDoctorId, appointment.DateTime))) {
                    if (await this.verifyAppointment.VerifyRole(appointment.getDoctorId))
                        resolve(this.appointmentRepository.createAppointment(appointment));
                    else
                        reject({ message: 'No puedes crear una cita', statusCode: HttpStatus.UNAUTHORIZED });
                }
                else
                    reject({ message: 'Solo puedes crear una cita cada hora', statusCode: HttpStatus.BAD_REQUEST });
            }
        });
    }
    ExecuteList = async (): Promise<Appointments[]> => {
        return await this.appointmentRepository.listAppointments({});
    }

    ExecuteSelector = async (selectorModel: AppointmentSelectorModel): Promise<{}> => {
        return new Promise(async (resolve, reject) => {
            const appointment: any = await this.verifyAppointment.VerifyAppointmentStatus(selectorModel.getAppointmentId, selectorModel.getAppointmentDate);
            if (appointment && typeof (appointment.costappointment) === 'number') {
                const user: any = await this.verifyAppointment.VerifyIfCustomerHaveBalance(selectorModel.getUserId, appointment.costappointment);
                if (user && typeof (user.dni) === 'string') {
                    const status = this.verifyAppointment.VerifyDNI(user.dni, selectorModel.getWeekDay);
                    if (status) {
                        resolve(this.appointmentRepository.takeAppointment(appointment, user));
                    }
                    else reject({ message: 'No te encuentras en día pico y cédula', statusCode: HttpStatus.BAD_REQUEST });
                }
                else reject({ message: 'No tienes saldo disponible', statusCode: HttpStatus.BAD_REQUEST });
            }
            else reject({ mesage: 'La cita no se encuentra disponible', statusCode: HttpStatus.BAD_REQUEST });
        });
    }

    ExecuteCanceller = async (idAppointment: number, userId: number): Promise<{}> => {

        return new Promise(async (resolve, reject) => {
            const AppointmentUser: Appointments | boolean = await this.verifyAppointment.VerifyAppointmentByIdsAndReturn(idAppointment, userId);
            if (!(typeof (AppointmentUser) === 'boolean')) {
                const user: User = await this.userRepository.findOneById(userId);
                if (user) {
                    resolve(this.appointmentRepository.cancelAppointment(AppointmentUser, user));
                }
                else
                    reject({ message: 'El usuario no existe', statusCode: HttpStatus.BAD_REQUEST });
            }
            else {
                const Appointment: Appointments | boolean = await this.verifyAppointment.VerifyAppointmentByIdAndReturn(idAppointment);
                if (!(typeof (Appointment) === 'boolean')) {
                    resolve(this.appointmentRepository.cancelAppointmentWithoutUser(Appointment));
                }
                else
                    reject({ message: 'La cita no existe', statusCode: HttpStatus.BAD_REQUEST });
            }
        })

    }

    ExecuteDeletor = async (appointmentId: number, userId: number): Promise<{}> => {
        return new Promise(async (resolve, reject) => {
            if (await this.verifyAppointment.VerifyRole(userId))
                resolve(this.appointmentRepository.deleteAppointment(appointmentId));
            else
                reject({ message: 'No puedes cancelar una cita', statusCode: HttpStatus.UNAUTHORIZED });
        })

    }
}