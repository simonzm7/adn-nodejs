import { Injectable } from "@nestjs/common";
import { AppointmentModel } from "src/domain/Appointments/Model/AppointmentModel";
import { AppointmentDBRepository } from "src/domain/Appointments/Repository/AppointmentDBRepository";
import { InjectRepository } from "@nestjs/typeorm";
import { Appointments } from "../../DBEntities/appointment.entity";
import { Repository } from "typeorm";
import { ActionType } from "src/domain/Appointments/Repository/Enums/ActionType";
import { DBRepository } from "src/domain/UserActions/Users/repositories/DB/DBRepository";
import { User } from "src/infraestructure/Users/EntityManager/user.entity";
import { getConnection } from "typeorm";
import { SuccessExcp } from "src/domain/Exceptions/SuccessExcp";
import { BussinessExcp } from "src/domain/Exceptions/BussinessExcp";
import { CommandsPaymentsUseCase } from "src/application/Payments/Command/CommandsPaymentsUseCase";
import { PaymentType } from "src/domain/Payments/Repository/Enums/PaymentType";

@Injectable()
export class AppointmentDBAdapter implements AppointmentDBRepository {
    constructor(@InjectRepository(Appointments) private readonly appointmentEntity: Repository<Appointments>,
        private readonly userRepository: DBRepository,
        private readonly commandsPaymentsUseCase: CommandsPaymentsUseCase) { }

    createAppointment = async (appointment: AppointmentModel) => {
        await this.appointmentEntity.save({
            idDoctor: appointment.getDoctorId,
            doctorname: appointment.getDoctorname,
            appointmentdate: appointment.getAppointmentDate,
            costappointment: appointment.getCost,
            appointmentStatus: 0,
            idUser: -1,
            createdAt: new Date().toLocaleString()
        })
        throw new SuccessExcp({ code: 'appointment_created' });
    }
    listAppointments = async (parameters: []): Promise<Appointments[]> => {
        const result = await this.appointmentEntity.find({
            where: parameters
        });
        return result;
    }

    findAppointmentByIdAndStatus = async (idAppointment: number): Promise<Appointments> => {
        return await this.appointmentEntity.findOne({
            where: {
                idAppointment,
                appointmentStatus: 0
            }
        });
    }

    findAppointmentByIds = async (idAppointment: number, idUser: number): Promise<Appointments> => {
        return await this.appointmentEntity.findOne({
            where: [
                { idAppointment, appointmentStatus: 1, idUser },
                { idAppointment, appointmentStatus: 0 }
            ]
        });
    }
    findAppointmentById = async (idAppointment: number): Promise<Appointments> => {
        return await this.appointmentEntity.findOne({ idAppointment });
    }
    findAppointmentByIdAndDelete = async (idAppointment: number) => {
        const verify = await this.appointmentEntity.findOne({ idAppointment });
        if (!verify)
            throw new BussinessExcp({ code: 'appointment_not_exists' });

        await getConnection().createQueryBuilder()
            .delete()
            .from(Appointments)
            .where('idAppointment = :idAppointment', { idAppointment })
            .execute()
            .catch(() => { throw new BussinessExcp({ code: 'appointment_failed_elimination' }) });
    }
    putAppointment = async (appointment: Appointments, actionType: ActionType, user: User) => {
        await this.appointmentEntity.save(appointment)
            .then(async () => {
                switch (actionType) {
                    case ActionType.Take:
                        user.balance = user.balance - appointment.costappointment
                        await this.commandsPaymentsUseCase.executeCreator({
                            idUser: user.userId,
                            idAppointment: appointment.idAppointment,
                            paymentValue: appointment.costappointment,
                            paymentType: PaymentType.PAYMENT
                        });
                        break;
                    case ActionType.CancelAndReturn:
                        user.balance = Number(user.balance) + Number(appointment.costappointment);
                        await this.commandsPaymentsUseCase.executeDeletor(user.userId, appointment.idAppointment);
                        break;
                }
                await this.userRepository.updateUser(user, appointment.idAppointment);
                throw new SuccessExcp({ code: `appointment_${actionType}` });
            })
    }

}