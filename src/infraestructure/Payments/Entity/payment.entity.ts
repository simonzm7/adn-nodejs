import {Entity,Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PaymentsEntity{

    @PrimaryGeneratedColumn()
    idPayment : number;

    @Column()
    idUser : number;

    @Column()
    idAppointment : number;

    @Column()
    paymentValue : number;

    @Column()
    paymentType : string;

    @Column()
    createdAt : Date;

}
