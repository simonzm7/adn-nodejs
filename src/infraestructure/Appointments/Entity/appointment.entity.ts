import {Entity,Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AppointmentEntity{

    @PrimaryGeneratedColumn()
    idAppointment : number;

    @Column()
    idDoctor : number;

    @Column()
    doctorname : string;

    @Column()
    appointmentdate : string;

    @Column()
    costappointment : number;

    @Column()
    appointmentStatus : number;

    @Column()
    idUser : number;

    @Column()
    createdAt : Date;

}