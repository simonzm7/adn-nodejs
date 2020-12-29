import { HttpStatus, Injectable } from "@nestjs/common";
import { AppointmentModel } from "src/domain/Appointments/Model/AppointmentModel";
import { AppointmentDBRepository } from "src/domain/Appointments/Repository/AppointmentDBRepository";
import { InjectRepository } from "@nestjs/typeorm";
import { Appointments } from "../DBEntities/appointment.entity";
import { Repository } from "typeorm";
import { ActionType } from "src/domain/Appointments/Repository/Enums/ActionType";
import { DBRepository } from "src/domain/Users/repositories/DB/DBRepository";
import { User } from "src/infraestructure/Users/EntityManager/user.entity";
import { getConnection } from "typeorm";

@Injectable()
export class AppointmentDBAdapter implements AppointmentDBRepository {
    constructor(@InjectRepository(Appointments) private readonly appointmentEntity: Repository<Appointments>,
        private readonly userRepository: DBRepository) { }

    createAppointment = async (appointment: AppointmentModel): Promise<{}> => {
        return new Promise(async (resolve, reject) => {
            await this.appointmentEntity.save({
                idDoctor: appointment.getDoctorId,
                doctorname: appointment.doctorname,
                appointmentdate: appointment.appointmentDate,
                costappointment: appointment.cost,
                appointmentStatus: 0,
                IsFestive: `${appointment.IsFestive}`,
                idUser: null
            })
                .then(() => resolve({ statusCode: HttpStatus.OK, message: 'Cita creada correctamente' }))
                .catch(() => reject({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error al crear la cita' }))
        });
    }
    listAppointments = async (): Promise<Appointments[]> => {
        const result = await this.appointmentEntity.find({ idUser: null });
        return result;
    }

    findAppointmentByIdAndStatus = async (idAppointment: number): Promise<Appointments> => {
        return await this.appointmentEntity.findOne({ idAppointment, appointmentStatus: 0 });
    }

    findAppointmentByIds = async (idAppointment: number, idUser: number): Promise<Appointments> => {
        return await this.appointmentEntity.findOne({ idAppointment, appointmentStatus: 1, idUser });
    }
    findAppointmentById = async (idAppointment: number): Promise<Appointments> => {
        return await this.appointmentEntity.findOne({ idAppointment });
    }
    findAppointmentByIdAndDelete = async (idAppointment: number) : Promise<{}>=> {
        return new Promise(async (resolve, reject) => {
            const verify = await this.appointmentEntity.findOne({ idAppointment });
            if (verify) {
                await getConnection().createQueryBuilder()
                    .delete()
                    .from(Appointments)
                    .where('idAppointment = :idAppointment', { idAppointment })
                    .execute()
                    .then(() => resolve({statusCode: HttpStatus.OK, message: 'Cita eliminada correctamente' }))
                    .catch(() => reject({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error al eliminar la cita' }));

            }
            reject({message: 'Cita no existente', statusCode: HttpStatus.BAD_REQUEST});
        });
    }
    putAppointment = async (appointment: Appointments, actionType: ActionType, user: User) : Promise<{}> => {
        return new Promise((resolve, reject) => {
            this.appointmentEntity.save(appointment)
                .then(async () => {
                    if (user && actionType === ActionType.Take) user.balance = user.balance - appointment.costappointment;
                    if (user && actionType === ActionType.Cancel) user.balance = Number(user.balance) + Number(appointment.costappointment);
                    if (user) await this.userRepository.UpdateBalance(user);
                    resolve({ message: `Cita ${actionType} correctamente`, statusCode: HttpStatus.OK });
                }).catch(() => {
                    reject({ message: 'Error al modificar la cita', statusCode: HttpStatus.BAD_REQUEST });
                });
        });
    }
}