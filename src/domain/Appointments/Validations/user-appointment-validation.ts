import { Injectable } from '@nestjs/common';
import { BussinessExcp } from 'src/domain/Exceptions/BussinessExcp';
import { UnauthorizedExcp } from 'src/domain/Exceptions/UnauthorizedExcp';
import { DaoUser } from 'src/domain/UserActions/Users/port/User/dao/dao-user';
import { AppointmentEntity } from 'src/infraestructure/Appointments/Entity/appointment.entity';
import { UserEntity } from 'src/infraestructure/Users/Entity/user.entity';
import { DaoAppointment } from '../port/Appointments/dao/dao-appointments';
import { UserAppointmentValidationRepository } from '../port/Validations/user-appointment-validation-repository';
import { ActionType } from '../Enums/ActionType';
import { Roles } from '../Enums/Roles';
import { WeekDays } from '../Enums/WeekDays';


@Injectable()
export class UserAppointmentValidation implements UserAppointmentValidationRepository {

    private readonly DNI_START = 9;
    private readonly DNI_END = 10;

    constructor(private readonly daoUser: DaoUser,
        private readonly daoAppointment: DaoAppointment) { }
    verifyAutoSelect = async (idUser: number, appointmentId: number) => {
        const appointment: AppointmentEntity = await this.daoAppointment.findAppointmentById(appointmentId);
        
        if (Number(appointment.idDoctor) === Number(idUser))
            throw new BussinessExcp({ code: 'auto_appointment' });

    }

    verifyRole = async (userId: number) => {
        const user: UserEntity = await this.daoUser.findOneById(userId);
        if (!user)
            throw new BussinessExcp({ code: 'email_not_found' });

        if (!(user.role.toLocaleLowerCase() === 'doctor'))
            throw new UnauthorizedExcp({ code: 'invalid_permisons' });
    }

    verifyDNI = (dni: string, weekDay: number) => {
        if ((+(dni.substring(this.DNI_START, this.DNI_END))) % 2 === 0) {
            if (!(weekDay === WeekDays.Monday || weekDay === WeekDays.Wednesday || weekDay === WeekDays.Friday))
                throw new BussinessExcp({ code: 'invalid_dni_day' });

        }
        if ((+(dni.substring(this.DNI_START, this.DNI_END))) % 2 === 1) {
            if (!(weekDay === WeekDays.Tuesday || weekDay === WeekDays.Thursday || weekDay === WeekDays.Saturday))
                throw new BussinessExcp({ code: 'invalid_dni_day' });
        }
    }

    verifyIfCustomerHaveBalance = async (userId: number, appointmentCost): Promise<UserEntity> => {
        const user: UserEntity = await this.daoUser.findOneById(userId);
        if (!(user && user.balance >= appointmentCost)) throw new BussinessExcp({ code: 'insuficient_balance' });

        return Promise.resolve(user);
    }

    verifyDoctorActionType = (appointment: AppointmentEntity, user: UserEntity): ActionType => {
        if (user.role === Roles.Doctor)
            if (appointment.idUser === -1)
                return ActionType.Cancel;
            else
                return ActionType.CancelAndReturn;
    }
    verifyCustomerActionType = (appointment: AppointmentEntity, user: UserEntity): ActionType => {
        if (user.role === Roles.Customer)
            if (!(appointment.idUser === user.userId))
                return ActionType.CancelAndReturn;
    }
}