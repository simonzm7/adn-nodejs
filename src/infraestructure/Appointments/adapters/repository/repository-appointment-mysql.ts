import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from 'src/domain/Appointments/Model/Appointment';
import { AppointmentRepository } from 'src/domain/Appointments/port/Appointments/repository/appointment-repository';
import { ActionType } from 'src/domain/Appointments/Enums/ActionType';
import { BussinessExcp } from 'src/domain/Exceptions/BussinessExcp';
import { SuccessExcp } from 'src/domain/Exceptions/SuccessExcp';
import { PaymentType } from 'src/domain/Payments/Enums/PaymentType';
import { PaymentModel } from 'src/domain/Payments/Model/Payment';
import { RepositoryPayments } from 'src/domain/Payments/Port/repository/repository-payments';
import { RepositoryUser } from 'src/domain/UserActions/Users/port/User/repository/repository-user';
import { AppointmentEntity } from 'src/infraestructure/Appointments/Entity/appointment.entity';
import { UserEntity } from 'src/infraestructure/Users/Entity/user.entity';
import { getConnection, Repository } from 'typeorm';

@Injectable()
export class RepositoryAppointmentMysql implements AppointmentRepository {
    constructor(@InjectRepository(AppointmentEntity) private readonly appointmentEntity: Repository<AppointmentEntity>,
        private readonly repositoryUser: RepositoryUser,
        private readonly paymentRepository: RepositoryPayments) { }

    public createAppointment = async (appointment: Appointment) => {
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
    };

    public updateAppointment = async (appointment: AppointmentEntity, actionType: ActionType, user: UserEntity) => {
        await this.appointmentEntity.save(appointment)
            .then(async () => {
                switch (actionType) {
                    case ActionType.Take:
                        user.balance = user.balance - appointment.costappointment;

                        await this.paymentRepository.createPayment(new PaymentModel({
                            idUser: user.userId,
                            idAppointment: appointment.idAppointment,
                            paymentValue: appointment.costappointment,
                            paymentType: PaymentType.PAYMENT
                        }));

                        break;
                    case ActionType.CancelAndReturn:
                        user.balance = Number(user.balance) + Number(appointment.costappointment);
                        await this.paymentRepository.deletePayment(new PaymentModel({
                            idUser: user.userId,
                            idAppointment: appointment.idAppointment
                        }));
                }
                await this.repositoryUser.updateUser(user, appointment.idAppointment);
                throw new SuccessExcp({ code: `appointment_${actionType}` });
            });
    };
    public deleteAppointment = async (idAppointment: number) => {
        const verify = await this.appointmentEntity.findOne({ idAppointment });
        if (!verify){
            throw new BussinessExcp({ code: 'appointment_not_exists' });}

        await getConnection().createQueryBuilder()
            .delete()
            .from(AppointmentEntity)
            .where('idAppointment = :idAppointment', { idAppointment })
            .execute()
            .catch(() => { throw new BussinessExcp({ code: 'appointment_failed_elimination' }) });
        throw new SuccessExcp({ code: 'appointment_deleted' })
    };
}
