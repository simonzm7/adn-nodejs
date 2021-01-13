import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DaoAppointment } from 'src/domain/Appointments/port/Appointments/dao/dao-appointments';
import { AppointmentEntity } from 'src/infraestructure/Appointments/Entity/appointment.entity';
import { Repository } from 'typeorm';


@Injectable()
export class DaoAppointmentMysql implements DaoAppointment {

    constructor(@InjectRepository(AppointmentEntity) private readonly appointmentEntity: Repository<AppointmentEntity>) { }

    public listAppointments = async (columns: [], parameters: {}[]): Promise<{}[]> => {
        return this.appointmentEntity.find({
            select: columns,
            where: parameters
        });
    };
    public findAppointmentByParameters = async (parameters : {}[]) => {
        return this.appointmentEntity.findOne({
            where: parameters
        });
    };
}
