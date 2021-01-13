import * as request from 'supertest';
import { createSandbox, SinonStubbedInstance } from 'sinon';
import { Test } from '@nestjs/testing';
import { createStubObj } from 'test/util/createObjectStub';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { AppointmentController } from 'src/infraestructure/Appointments/controllers/appointment.controller';
import { BussinessExcp } from 'src/domain/Exceptions/BussinessExcp';
import { UnauthorizedExcp } from 'src/domain/Exceptions/UnauthorizedExcp';
import { QueryAppointmentHandler } from 'src/application/Appointments/query/query-appointment-handler';
import { CommandAppointmentHandler } from 'src/application/Appointments/command/command-appointment-handler';
import { DaoAppointment } from 'src/domain/Appointments/port/Appointments/dao/dao-appointments';
import { AppointmentService } from 'src/domain/Appointments/Services/AppointmentCommandService/AppointmentService';
import { AppointmentRepository } from 'src/domain/Appointments/port/Appointments/repository/appointment-repository';
import { UsersValidationsRepository } from 'src/domain/UserActions/Users/port/Validations/repository/user-validations-repository';
import { DateValidationRepository } from 'src/domain/Appointments/port/Validations/date-validation-repository';
import { UserAppointmentValidationRepository } from 'src/domain/Appointments/port/Validations/user-appointment-validation-repository';
import { AppointmentValidationRepository } from 'src/domain/Appointments/port/Validations/appointment-validation-repository';
import { CommandCreateAppointment } from 'src/application/Appointments/command/command-create-appointment';
import { AppointmentEntity } from 'src/infraestructure/Appointments/Entity/appointment.entity';
import { UserEntity } from 'src/infraestructure/Users/Entity/user.entity';
const sinonSandbox = createSandbox();
describe('AppointmentController', () => {
    let app: INestApplication;
    let queryAppointmentHandler: SinonStubbedInstance<QueryAppointmentHandler>;
    let daoAppointment: SinonStubbedInstance<DaoAppointment>;
    let appointmentRepository: SinonStubbedInstance<AppointmentRepository>;
    let usersValidationsRepository: SinonStubbedInstance<UsersValidationsRepository>;
    let dateValidationsRepository: SinonStubbedInstance<DateValidationRepository>;
    let userAppointmentValidationRepository: SinonStubbedInstance<UserAppointmentValidationRepository>;
    let appointmenttValidationRepository: SinonStubbedInstance<AppointmentValidationRepository>;
    beforeAll(async () => {

        queryAppointmentHandler = createStubObj<QueryAppointmentHandler>(['executeList', 'executeAgendaList' , 'executeMyList'], sinonSandbox);

        daoAppointment = createStubObj<DaoAppointment>(
            ['findAppointmentByParameters', 'listAppointments'], sinonSandbox);

        appointmentRepository = createStubObj<AppointmentRepository>(
            ['createAppointment', 'deleteAppointment', 'updateAppointment'], sinonSandbox);

        usersValidationsRepository = createStubObj<UsersValidationsRepository>(
            ['userAlreadyExists', 'userAlreadyExistsAndReturn'], sinonSandbox);

        appointmenttValidationRepository = createStubObj<AppointmentValidationRepository>(
            ['verifyAppointmentByParameters', 'verifyAppointmentIsAvailable'], sinonSandbox);
        
        dateValidationsRepository = createStubObj<DateValidationRepository>(
            ['verifyAppointmentValidDate', 'verifyHourDiference', 'verifyIfCustomerHaveAppointment', 'verifyIfDoctorHaveAppointment'], sinonSandbox);
           
            userAppointmentValidationRepository = createStubObj<UserAppointmentValidationRepository>(
                ['verifyAutoSelect', 'verifyCustomerActionType', 'verifyDNI', 'verifyDoctorActionType', 'verifyIfCustomerHaveBalance', 'verifyRole'], sinonSandbox
            );   
            const moduleRef = await Test.createTestingModule({
            controllers: [AppointmentController],
            providers: [QueryAppointmentHandler,
                CommandAppointmentHandler,
                AppointmentService,
                { provide: DaoAppointment, useValue: daoAppointment },
                { provide: AppointmentRepository, useValue: appointmentRepository },
                { provide: UsersValidationsRepository, useValue: usersValidationsRepository },
                { provide: DateValidationRepository, useValue: dateValidationsRepository },
                { provide: UserAppointmentValidationRepository, useValue: userAppointmentValidationRepository },
                { provide: AppointmentValidationRepository, useValue: appointmenttValidationRepository },
                {provide: QueryAppointmentHandler, useValue : queryAppointmentHandler}
                
            ]

        }).compile();

        app = moduleRef.createNestApplication();
        await app.init();
    });
    afterEach(() => sinonSandbox.restore());
    afterAll(async () => await app.close());
    const commonHeader = {
        userid: 1
    }

    it('It should be fail if the appointment Date not is specific format', async () => {

        const appointment: any = {
            idDoctor: 1,
            doctorname: 'DOCTOR NAME',
            appointmentDate: '000/29/11/2020/8:00:00',
            cost: 80500,
        }
        const response: request.Response = await request(app.getHttpServer())
            .post('/api/appointments')
            .set(commonHeader)
            .send(appointment)
            .expect(HttpStatus.BAD_REQUEST);
        expect(response.body.message.code).toEqual('invalid_date_format');
    });

    it('It should be fail if the cost is higher to 1000000', async () => {
        const appointment: any = {
            idDoctor: 1,
            doctorname: 'DOCTOR NAME',
            appointmentDate: '29/11/2020/8:00',
            cost: 2000000,
            status: 0,
            IsFestive: false,
            idUser: null
        }
        const response: request.Response = await request(app.getHttpServer())
            .post('/api/appointments').set(commonHeader).send(appointment)
            .expect(HttpStatus.BAD_REQUEST);
        expect(response.body.message.code).toEqual('invalid_maximum_appointment_cost');
    });

    it('It should be fail if the cost is less to 0', async () => {
        const appointment: any = {
            idDoctor: 1,
            doctorname: 'DOCTOR NAME',
            appointmentDate: '29/11/2020/8:00',
            cost: -10,
            status: 0,
            IsFestive: false,
            idUser: null
        }
        const response: request.Response = await request(app.getHttpServer())
            .post('/api/appointments').set(commonHeader).send(appointment)
            .expect(HttpStatus.BAD_REQUEST);
        expect(response.body.message.code).toEqual('invalid_cost_format');
    });


    it('It should be fail if is Sunday', async () => {

        const appointment: any = {
            idDoctor: 1,
            doctorname: 'DOCTOR NAME',
            appointmentDate: '27/11/2020/11:00', // Real calendar
            cost: 80500,
            status: 0,
            IsFestive: false,
            idUser: null
        }
        const response: request.Response = await request(app.getHttpServer())
            .post('/api/appointments').set(commonHeader).send(appointment)
            .expect(HttpStatus.BAD_REQUEST);
        expect(response.body.message.code).toEqual('invalid_appointment_day');
    });

    it('It should be fail if is not is working hours', async () => {

        const appointment: any = {
            idDoctor: 1,
            doctorname: 'DOCTOR NAME',
            appointmentDate: '28/11/2020/6:00',
            cost: 80500,
            status: 0,
            IsFestive: false,
            idUser: null
        }
        const response: request.Response = await request(app.getHttpServer())
            .post('/api/appointments').set(commonHeader).send(appointment)
            .expect(HttpStatus.BAD_REQUEST);
        expect(response.body.message.code).toEqual('invalid_appointment_schedule');
    });










    it('It should get available appointments list', async () => {
        const appoitmentsList: any = [{ idAppointment: 1, idDoctor: 1, doctorname: 'firstname lastname', appointmentdate: '2020-12-28 07:00:00.000', costappointment: 80500, appointmentStatus: 0, idUser: null, createdAt: new Date().toString() }];

        await queryAppointmentHandler.executeList.returns(appoitmentsList);

        const response = await request(app.getHttpServer())
            .get('/api/appointments')
            .set(commonHeader)
            .expect(HttpStatus.OK);
        expect(response.body.message).toEqual(appoitmentsList);

    });

    it('It should get my appointments list', async () => {
        const appoitmentsList: any = [{ idAppointment: 1, idDoctor: 1, doctorname: 'firstname lastname', appointmentdate: '2020-12-28 07:00:00.000', costappointment: 80500, appointmentStatus: 1, idUser: 1, createdAt: new Date().toString() }];

        await queryAppointmentHandler.executeMyList.returns(appoitmentsList);

        const response = await request(app.getHttpServer())
            .get('/api/appointments/me')
            .set(commonHeader)
            .expect(HttpStatus.OK);
        expect(response.body.message).toEqual(appoitmentsList);

    });


    it('It should get agenda appointments list', async () => {
        const appoitmentsList: any = [{ date: '', state: 0 }];

        await queryAppointmentHandler.executeAgendaList.returns(appoitmentsList);

        const response = await request(app.getHttpServer())
            .get('/api/appointments/agenda')
            .set(commonHeader)
            .expect(HttpStatus.OK);
        expect(response.body.message).toEqual(appoitmentsList);

    });
    const appointment_command : CommandCreateAppointment = {
        idDoctor: 1,
        doctorname: 'DOCTOR NAME',
        appointmentDate: '29/11/2020/8:00',
        cost: 0,
        idUser: 0
    }

    it('should be fail if the doctor want create appointment in the past', async () => {

        dateValidationsRepository.verifyAppointmentValidDate.throws(new BussinessExcp({ code: 'appointment_create_expired' }));
        const response: request.Response = await request(app.getHttpServer())
            .post('/api/appointments')
            .set(commonHeader)
            .send(appointment_command)
            .expect(HttpStatus.BAD_REQUEST);

        expect(response.body.message.code).toBe('appointment_create_expired');
    });

    it('It should be fail if the doctor have an appointment on the same hour', async () => {

        dateValidationsRepository.verifyAppointmentValidDate.returns({});
        dateValidationsRepository.verifyIfDoctorHaveAppointment.throws(new BussinessExcp({ code: 'invalid_appointment_hour' }));
        const response: request.Response = await request(app.getHttpServer())
            .post('/api/appointments')
            .set(commonHeader)
            .send(appointment_command)
            .expect(HttpStatus.BAD_REQUEST);

        expect(response.body.message.code).toEqual('invalid_appointment_hour');
    });
    it('It should be fail if the role is a Customer', async () => {

        dateValidationsRepository.verifyAppointmentValidDate.returns({});
        dateValidationsRepository.verifyIfDoctorHaveAppointment.returns({});
        userAppointmentValidationRepository.verifyRole.throws(new UnauthorizedExcp({ code: 'invalid_permisons' }))
        const response: request.Response = await request(app.getHttpServer())
            .post('/api/appointments')
            .set(commonHeader)
            .send(appointment_command)
            .expect(HttpStatus.UNAUTHORIZED);
        expect(response.body.message.code).toBe('invalid_permisons');
    });

    it('should fail if the user wants to select his appointment', async () => {
        const selecte_appointment: any = {
            AppointmentId: 1,
            week: '28/11/2020/7:00',
        }

        userAppointmentValidationRepository.verifyAutoSelect.throws(new BussinessExcp({ code: 'auto_appointment' }));

        const response: request.Response = await request(app.getHttpServer())
            .put('/api/appointments').set({ userId: 1 }).send(selecte_appointment)
            .expect(HttpStatus.BAD_REQUEST);
        expect(response.body.message.code).toEqual('auto_appointment');
    });

    it('should fail if the user have an appointment in the same hour', async () => {
        const selecte_appointment: any = {
            AppointmentId: 1,
            week: '28/11/2020/7:00',
        }

        userAppointmentValidationRepository.verifyAutoSelect.returns({});
        dateValidationsRepository.verifyIfCustomerHaveAppointment.throws(new BussinessExcp({ code: 'invalid_appointment_hour' }))

        const response: request.Response = await request(app.getHttpServer())
            .put('/api/appointments').set({ userId: 1 }).send(selecte_appointment)
            .expect(HttpStatus.BAD_REQUEST);
        expect(response.body.message.code).toEqual('invalid_appointment_hour');
    });


    it('It should be fail if the appointment not is available', async () => {
        const selecte_appointment: any = {
            AppointmentId: 1,
            week: '28/11/2020/7:00',
        }
        userAppointmentValidationRepository.verifyAutoSelect.returns({});
        dateValidationsRepository.verifyIfCustomerHaveAppointment.returns({});
        appointmenttValidationRepository.verifyAppointmentByParameters.throws(new BussinessExcp({ code: 'appointment_not_exists' }));

        const response: request.Response = await request(app.getHttpServer())
            .put('/api/appointments').set({ userId: 1 }).send(selecte_appointment)
            .expect(HttpStatus.BAD_REQUEST);
        expect(response.body.message.code).toEqual('appointment_not_exists');
    });

    it('It should be fail if the usar want to select appointment in the past', async () => {
        const selecte_appointment: any = {
            AppointmentId: 1,
            week: '28/11/2020/7:00',
        }
        userAppointmentValidationRepository.verifyAutoSelect.returns({});
        dateValidationsRepository.verifyIfCustomerHaveAppointment.returns({});
        appointmenttValidationRepository.verifyAppointmentByParameters.returns(Promise.resolve(new AppointmentEntity()));
        dateValidationsRepository.verifyAppointmentValidDate.throws(new BussinessExcp({ code: 'appointment_select_expired' }));

        const response: request.Response = await request(app.getHttpServer())
            .put('/api/appointments').set({ userId: 1 }).send(selecte_appointment)
            .expect(HttpStatus.BAD_REQUEST);
        expect(response.body.message.code).toEqual('appointment_select_expired');
    });

    it("It should be fail if the Customer don't have balance", async () => {

    userAppointmentValidationRepository.verifyAutoSelect.returns({});
    dateValidationsRepository.verifyIfCustomerHaveAppointment.returns({});
    appointmenttValidationRepository.verifyAppointmentByParameters.returns(Promise.resolve(new AppointmentEntity()));
    dateValidationsRepository.verifyAppointmentValidDate.returns({});
    userAppointmentValidationRepository.verifyIfCustomerHaveBalance.throws(new BussinessExcp({ code: 'insuficient_balance' }));

    const selectAppointment: any = {
        AppointmentId: 1,
        week: '28/11/2020/7:00',
    }
    const response: request.Response = await request(app.getHttpServer())
        .put('/api/appointments').set(commonHeader).send(selectAppointment)
        .expect(HttpStatus.BAD_REQUEST);
    expect(response.body.message.code).toEqual('insuficient_balance');
});

it("It should be fail if the Customer don't have dni day", async () => {

const user: any = {
    userId: 1,
    email: 'asd@asd.com',
    password: '12345',
    firstname: 'firstname',
    lastname: 'lastname',
    dni: '1234567890',
    balande: 1000000,
    role: 'Customer'
}
userAppointmentValidationRepository.verifyAutoSelect.returns({});
dateValidationsRepository.verifyIfCustomerHaveAppointment.returns({});
appointmenttValidationRepository.verifyAppointmentByParameters.returns(Promise.resolve(new AppointmentEntity()));
dateValidationsRepository.verifyAppointmentValidDate.returns({});
userAppointmentValidationRepository.verifyIfCustomerHaveBalance.returns(Promise.resolve(new UserEntity()));
userAppointmentValidationRepository.verifyDNI.throws(new BussinessExcp({ code: 'invalid_dni_day' }));

const selectAppointment: any = {
    AppointmentId: 1,
    week: '28/11/2020/7:00',
}
const response: request.Response = await request(app.getHttpServer())
    .put('/api/appointments').set(commonHeader).set(commonHeader).send(selectAppointment)
    .expect(HttpStatus.BAD_REQUEST);
expect(response.body.message.code).toEqual('invalid_dni_day');
        });

// // //  Cancel Appointment
it('It should be fail if the appointment do not exists', async () => {

    appointmenttValidationRepository.verifyAppointmentByParameters.throws(new BussinessExcp({ code: 'appointment_not_exists' }));
    const response: request.Response = await request(app.getHttpServer())
        .put('/api/appointments/1')
        .set(commonHeader)
        .expect(HttpStatus.BAD_REQUEST);
    expect(response.body.message.code).toEqual('appointment_not_exists');
});

it('It should be fail if the user do not exists', async () => {

    appointmenttValidationRepository.verifyAppointmentByParameters.returns(Promise.resolve(new AppointmentEntity()));
    usersValidationsRepository.userAlreadyExistsAndReturn.throws(new BussinessExcp({ code: 'email_not_found' }));
    const response: request.Response = await request(app.getHttpServer())
        .put('/api/appointments/1')
        .set(commonHeader)
        .expect(HttpStatus.BAD_REQUEST);
    expect(response.body.message.code).toEqual('email_not_found');
});

it('It should be fail if the user do not is a Doctor', async () => {

    userAppointmentValidationRepository.verifyRole.throws(new UnauthorizedExcp({ code: 'invalid_permisons' }));
    const response: request.Response = await request(app.getHttpServer())
        .delete('/api/appointments/1')
        .set(commonHeader)
        .expect(HttpStatus.UNAUTHORIZED);
    expect(response.body.message.code).toEqual('invalid_permisons');
});
});



