import * as request from 'supertest';
import { createSandbox, SinonStubbedInstance } from "sinon";
import { Test } from "@nestjs/testing";
import { createStubObj } from 'test/util/createObjectStub';
import { Appointments } from 'src/infraestructure/Appointments/DBEntities/appointment.entity';
import { HttpStatus, INestApplication } from "@nestjs/common";
import { AppointmentRepository } from "src/domain/Appointments/Repository/AppointmentRepository";
import { AppointmentController } from "src/infraestructure/Appointments/controllers/appointment.controller";
import { CommandAppointmentCase } from "src/application/Appointments/UseCases/command/CommandAppointmentCase";
import { AppointmentService } from 'src/domain/Appointments/Services/AppointmentCommandService/AppointmentService';
import { AppointmentDTO } from 'src/domain/Appointments/Repository/DTO/AppointmentDTO';
import { DBRepository } from 'src/domain/UserActions/Users/repositories/DB/DBRepository';
import { QueryAppointmentCase } from 'src/application/Appointments/UseCases/query/QueryAppointmentCase';
import { BussinessExcp } from 'src/domain/Exceptions/BussinessExcp';
import { UnauthorizedExcp } from 'src/domain/Exceptions/UnauthorizedExcp';
import { AppointmentBussinessLogicRepository } from 'src/domain/Appointments/Repository/AppointmentBussinessLogicRepository';
import { UserBussinessLogicRepository } from 'src/domain/UserActions/Users/repositories/Users/UserBussinessLogicRepository';
import { AppointmentQueryRepository } from 'src/domain/Appointments/Repository/AppointmentQueryRepository';
import { User } from 'src/infraestructure/Users/EntityManager/user.entity';

const sinonSandbox = createSandbox();
describe('AppointmentController', () => {
    let app: INestApplication;
    let quertAppointmentCase : SinonStubbedInstance<QueryAppointmentCase>;
    let appointmentBussinessLogicRepository: SinonStubbedInstance<AppointmentBussinessLogicRepository>;
    let userBussinessLogicRepository: SinonStubbedInstance<UserBussinessLogicRepository>;
    let dbRepository: SinonStubbedInstance<DBRepository>;
    let appointmentQueryRepository: SinonStubbedInstance<AppointmentQueryRepository>;

    let appointmentRepository : SinonStubbedInstance<AppointmentRepository>;

    beforeAll(async () => {

        appointmentRepository = createStubObj<AppointmentRepository>([
            'cancelAppointment', 'createAppointment', 'deleteAppointment', 'listAppointments'
            ,'takeAppointment'
        ], sinonSandbox);

        quertAppointmentCase = createStubObj<QueryAppointmentCase>(['executeAgendaList', 'executeList', 'executeMyList'], sinonSandbox);

        appointmentBussinessLogicRepository = createStubObj<AppointmentBussinessLogicRepository>(['verifyIfDoctorHaveAppointment', 'verifyRole',
            'verifyAppointmentStatusAndReturn', 'verifyAppointmentByIdsAndReturn', 'verifyDNI'
            , 'verifyIfCustomerHaveBalance', 'verifyAutoSelect', 'verifyIfCustomerHaveAppointment', 'verifyAppointmentByIdAndReturn', 'verifyAppointmentValidDate'], sinonSandbox);

        dbRepository = createStubObj<DBRepository>(['updateUser', 'findOneById'], sinonSandbox);

        userBussinessLogicRepository = createStubObj<UserBussinessLogicRepository>(
            ['userAlreadyExists', 'userAlreadyExistsAndReturn', 'userHaveBalance', 'validationPassword'], sinonSandbox);

        appointmentQueryRepository = createStubObj<AppointmentQueryRepository>([
            'executeAgendaList'
        ], sinonSandbox);


        const moduleRef = await Test.createTestingModule({
            controllers: [AppointmentController],
            providers: [CommandAppointmentCase,
                AppointmentService,
                QueryAppointmentCase,
                AppointmentService,
                {provide: AppointmentRepository, useValue: appointmentRepository},
                { provide: QueryAppointmentCase, useValue: quertAppointmentCase },
                { provide: DBRepository, useValue: dbRepository },
                { provide: UserBussinessLogicRepository, useValue: userBussinessLogicRepository },
                { provide: AppointmentBussinessLogicRepository, useValue: appointmentBussinessLogicRepository }
                , { provide: AppointmentQueryRepository, useValue: appointmentQueryRepository }
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
        const appoitmentsList: any = [{ idAppointment: 1, idDoctor: 1, doctorname: "firstname lastname", appointmentdate: "2020-12-28 07:00:00.000", costappointment: 80500, appointmentStatus: 0, idUser: null, createdAt: new Date().toString() }];

        await quertAppointmentCase.executeList.returns(appoitmentsList);

        const response = await request(app.getHttpServer())
            .get('/api/appointments')
            .set(commonHeader)
            .expect(HttpStatus.OK);
        expect(response.body.message).toEqual(appoitmentsList);

    });

    it('It should get my appointments list', async () => {
        const appoitmentsList: any = [{ idAppointment: 1, idDoctor: 1, doctorname: "firstname lastname", appointmentdate: "2020-12-28 07:00:00.000", costappointment: 80500, appointmentStatus: 1, idUser: 1, createdAt: new Date().toString() }];

        await quertAppointmentCase.executeMyList.returns(appoitmentsList);

        const response = await request(app.getHttpServer())
            .get('/api/appointments/me')
            .set(commonHeader)
            .expect(HttpStatus.OK);
        expect(response.body.message).toEqual(appoitmentsList);

    });

    
    it('It should get agenda appointments list', async () => {
        const appoitmentsList: any = [{ date: '', state: 0}];

        await quertAppointmentCase.executeAgendaList.returns(appoitmentsList);

        const response = await request(app.getHttpServer())
            .get('/api/appointments/agenda')
            .set(commonHeader)
            .expect(HttpStatus.OK);
        expect(response.body.message).toEqual(appoitmentsList);

    });


    it('should be fail if the doctor want create appointment in the past', async () => {
        const appointment: AppointmentDTO = {
            idDoctor: 1,
            doctorname: 'DOCTOR NAME',
            appointmentDate: '29/11/2020/8:00',
            cost: 0,
            idUser: null
        }
        appointmentBussinessLogicRepository.verifyAppointmentValidDate.throws(new BussinessExcp({ code: 'appointment_create_expired' }));
        const response: request.Response = await request(app.getHttpServer())
            .post('/api/appointments')
            .set(commonHeader)
            .send(appointment)
            .expect(HttpStatus.BAD_REQUEST);

        expect(response.body.message.code).toBe('appointment_create_expired');
    });

    it('It should be fail if the doctor have an appointment on the same hour', async () => {
        const appointment: AppointmentDTO = {
            idDoctor: 1,
            doctorname: 'DOCTOR NAME',
            appointmentDate: '29/11/2020/8:00',
            cost: 0,
            idUser: null
        }
        appointmentBussinessLogicRepository.verifyAppointmentValidDate.returns({});
        appointmentBussinessLogicRepository.verifyIfDoctorHaveAppointment.throws(new BussinessExcp({ code: 'invalid_appointment_hour' }));
        const response: request.Response = await request(app.getHttpServer())
            .post('/api/appointments')
            .set(commonHeader)
            .send(appointment)
            .expect(HttpStatus.BAD_REQUEST);

        expect(response.body.message.code).toEqual('invalid_appointment_hour');
    });
    it('It should be fail if the role is a Customer', async () => {
        const appointment: AppointmentDTO = {
            idDoctor: 1,
            doctorname: 'DOCTOR NAME',
            appointmentDate: '29/11/2020/8:00',
            cost: 80500,
            idUser: null
        }
        appointmentBussinessLogicRepository.verifyAppointmentValidDate.returns({});
        appointmentBussinessLogicRepository.verifyIfDoctorHaveAppointment.returns({});
        appointmentBussinessLogicRepository.verifyRole.throws(new UnauthorizedExcp({ code: 'invalid_permisons' }))
        const response: request.Response = await request(app.getHttpServer())
            .post('/api/appointments')
            .set(commonHeader)
            .send(appointment)
            .expect(HttpStatus.UNAUTHORIZED);
        expect(response.body.message.code).toBe('invalid_permisons');
    });

    it('should fail if the user wants to select his appointment', async () => {
        const selecte_appointment: any = {
            AppointmentId: 1,
            week: '28/11/2020/7:00',
        }

        appointmentBussinessLogicRepository.verifyAutoSelect.throws(new BussinessExcp({ code: 'auto_appointment' }));

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

        appointmentBussinessLogicRepository.verifyAutoSelect.returns({});
        appointmentBussinessLogicRepository.verifyIfCustomerHaveAppointment.throws(new BussinessExcp({ code: 'invalid_appointment_hour' }))

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
        appointmentBussinessLogicRepository.verifyAutoSelect.returns({});
        appointmentBussinessLogicRepository.verifyIfCustomerHaveAppointment.returns({});
        appointmentBussinessLogicRepository.verifyAppointmentStatusAndReturn.throws(new BussinessExcp({ code: 'appointment_not_exists' }));

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
        appointmentBussinessLogicRepository.verifyAutoSelect.returns({});
        appointmentBussinessLogicRepository.verifyIfCustomerHaveAppointment.returns({});
        appointmentBussinessLogicRepository.verifyAppointmentStatusAndReturn.returns(Promise.resolve(new Appointments()));
        appointmentBussinessLogicRepository.verifyAppointmentValidDate.throws(new BussinessExcp({ code: 'appointment_select_expired' }));

        const response: request.Response = await request(app.getHttpServer())
            .put('/api/appointments').set({ userId: 1 }).send(selecte_appointment)
            .expect(HttpStatus.BAD_REQUEST);
        expect(response.body.message.code).toEqual('appointment_select_expired');
    });

    it("It should be fail if the Customer don't have balance", async () => {

        const appointment: any = {
            idAppointment: 1,
            idDoctor: 1,
            doctorname: "DOCTOR NAME",
            appointmentDate: "25/11/2020/10:59:59",
            costappointment: 80500,
            appointmentStatus: 0,
            IsFestive: 'false',
            idUser: 1
        }
        appointmentBussinessLogicRepository.verifyAutoSelect.returns({});
        appointmentBussinessLogicRepository.verifyIfCustomerHaveAppointment.returns({});
        appointmentBussinessLogicRepository.verifyAppointmentStatusAndReturn.returns(Promise.resolve(new Appointments()));
        appointmentBussinessLogicRepository.verifyAppointmentValidDate.returns({});
        appointmentBussinessLogicRepository.verifyIfCustomerHaveBalance.throws(new BussinessExcp({ code: 'insuficient_balance' }));

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

            const appointment : any = {
                idAppointment : 1,
                idDoctor: 1,
                doctorname: "DOCTOR NAME",
                appointmentDate: "25/11/2020/10:59",
                costappointment: 80500,
                appointmentStatus: 0,
                IsFestive: 'false',
                idUser: 1
            }
            const user : any = {
                userId: 1,
                email : 'asd@asd.com',
                password: '12345',
                firstname: 'firstname',
                lastname: 'lastname',
                dni: '1234567890',
                balande: 1000000,
                role: 'Customer'
            }
            appointmentBussinessLogicRepository.verifyAutoSelect.returns({});
            appointmentBussinessLogicRepository.verifyIfCustomerHaveAppointment.returns({});
            appointmentBussinessLogicRepository.verifyAppointmentStatusAndReturn.returns(Promise.resolve(new Appointments()));
            appointmentBussinessLogicRepository.verifyAppointmentValidDate.returns({});
            appointmentBussinessLogicRepository.verifyIfCustomerHaveBalance.returns(Promise.resolve(new User()));
            appointmentBussinessLogicRepository.verifyDNI.throws(new BussinessExcp({ code: 'invalid_dni_day' }));

            const selectAppointment: any = {
                AppointmentId: 1,
                week: '28/11/2020/7:00',
            }
            const response : request.Response = await request(app.getHttpServer())
                .put('/api/appointments').set(commonHeader).set(commonHeader).send(selectAppointment)
                .expect(HttpStatus.BAD_REQUEST);
                expect(response.body.message.code).toEqual('invalid_dni_day');
        });

    // // //  Cancel Appointment
        it("It should be fail if the appointment do not exists", async () => {

            appointmentBussinessLogicRepository.verifyAppointmentByIdsAndReturn.throws(new BussinessExcp({code:'appointment_not_exists'}));
            const response : request.Response = await request(app.getHttpServer())
                .put('/api/appointments/1')
                .set(commonHeader)
                .expect(HttpStatus.BAD_REQUEST);
                 expect(response.body.message.code).toEqual('appointment_not_exists');
        });

        it("It should be fail if the user do not exists", async () => {

            appointmentBussinessLogicRepository.verifyAppointmentByIdsAndReturn.returns(Promise.resolve(new Appointments()));
            userBussinessLogicRepository.userAlreadyExistsAndReturn.throws(new BussinessExcp({code:'email_not_found'}));
            const response : request.Response = await request(app.getHttpServer())
                .put('/api/appointments/1')
                .set(commonHeader)
                .expect(HttpStatus.BAD_REQUEST);
                expect(response.body.message.code).toEqual('email_not_found');
        });

        it("It should be fail if the user do not is a Doctor", async () => {

            appointmentBussinessLogicRepository.verifyRole.throws(new UnauthorizedExcp({code: 'invalid_permisons'}));
            const response : request.Response = await request(app.getHttpServer())
                .delete('/api/appointments/1')
                .set(commonHeader)
                .expect(HttpStatus.UNAUTHORIZED);
                expect(response.body.message.code).toEqual('invalid_permisons');
        });
});



