import * as request from 'supertest';
import { Test } from "@nestjs/testing";
import { INestApplication, HttpStatus } from "@nestjs/common";
import { createSandbox, SinonStubbedInstance } from "sinon";
import { abstractUser } from 'src/domain/UserActions/Users/repositories/Users/abstractUser';
import { createStubObj } from 'test/util/createObjectStub';
import { UserController } from 'src/infraestructure/Users/controllers/user.controller';
import { UserRegisterManagment } from 'src/application/Users/UseCases/UserRegisterManagment';
import { UserService } from 'src/domain/UserActions/Users/services/UserService';
import { UserDTO } from 'src/domain/UserActions/Users/repositories/Users/DTO/UserDTO';
import { BalanceService } from 'src/domain/UserActions/Users/services/BalanceService';
import { BussinessExcp } from 'src/domain/Exceptions/BussinessExcp';
import { UserBussinessLogicRepository } from 'src/domain/UserActions/Users/repositories/Users/UserBussinessLogicRepository';
import { User } from 'src/infraestructure/Users/EntityManager/user.entity';


const sinonSandbox = createSandbox();
describe('UserController', () => {

    let app: INestApplication;
    let userRepository: SinonStubbedInstance<abstractUser>;
    let userBussinessLogicRepository: SinonStubbedInstance<UserBussinessLogicRepository>;
    beforeAll(async () => {
        userRepository = createStubObj<abstractUser>(['createUser', 'updateBalance'], sinonSandbox);
        userBussinessLogicRepository = createStubObj<UserBussinessLogicRepository>(
            ['userAlreadyExists', 'userAlreadyExistsAndReturn', 'userHaveBalance', 'validationPassword'], sinonSandbox);
        const moduleRef = await Test.createTestingModule({
            controllers: [UserController],
            providers: [UserRegisterManagment, UserService, BalanceService,
                { provide: abstractUser, useValue: userRepository },
                { provide: UserBussinessLogicRepository, useValue: userBussinessLogicRepository }]
        }).compile();

        app = moduleRef.createNestApplication();
        await app.init();
    })
    afterEach(() => sinonSandbox.restore());
    afterAll(async () => await app.close());


    // USER VALIDATIONS

    it('It should be fail if the email not is and email', async () => {

        const user: UserDTO = {
            email: 'asd@@asd.com',
            password: '12345',
            firstname: 'firstname',
            lastname: 'lastname',
            dni: '1234567890',
            role: 'Customer'
        }
        const response = await request(app.getHttpServer())
            .post('/api/user').send(user)
            .expect(HttpStatus.BAD_REQUEST);
        expect(response.body.message).toEqual(['email must be an email']);
    });

    it('It should be fail if the password length is less than 4', async () => {

        const user: UserDTO = {
            email: 'asd@asd.com',
            password: '123',
            firstname: 'firstname',
            lastname: 'lastname',
            dni: '1234567890',
            role: 'Customer'
        }
        const response = await request(app.getHttpServer())
            .post('/api/user').send(user)
            .expect(HttpStatus.BAD_REQUEST);
        expect(response.body.message.code).toBe('invalid_password_minimum_length');
    });

    it('It should be fail if the password length is higher than 4', async () => {

        const user: UserDTO = {
            email: 'asd@asd.com',
            password: '1234567890123456789012345678901',
            firstname: 'firstname',
            lastname: 'lastname',
            dni: '1234567890',
            role: 'Customer'
        }
        const response = await request(app.getHttpServer())
            .post('/api/user').send(user)
            .expect(HttpStatus.BAD_REQUEST);
        expect(response.body.message.code).toBe('invalid_password_maximum_length');
    });

    it('It should be fail if the firstname not is a string only', async () => {

        const user: UserDTO = {
            email: 'asd@asd.com',
            password: '12345',
            firstname: 'asd@',
            lastname: 'asd!',
            dni: '1234567890',
            role: 'Customer'
        }
        const response = await request(app.getHttpServer())
            .post('/api/user').send(user)
            .expect(HttpStatus.BAD_REQUEST);


        expect(response.body.message.code).toBe('invalid_firstname_format');
    });

    it('It should be fail if the lastname not is a string only', async () => {

        const user: UserDTO = {
            email: 'asd@asd.com',
            password: '12345',
            firstname: 'asd',
            lastname: 'asd!',
            dni: '1234567890',
            role: 'Customer'
        }
        const response = await request(app.getHttpServer())
            .post('/api/user').send(user)
            .expect(HttpStatus.BAD_REQUEST);


        expect(response.body.message.code).toBe('invalid_lastname_format');
    });

    it('It should be fail if the dni not is a numeric only', async () => {

        const user: UserDTO = {
            email: 'asd@asd.com',
            password: '12345',
            firstname: 'asd',
            lastname: 'asd',
            dni: '123456789@',
            role: 'Customer'
        }
        const response = await request(app.getHttpServer())
            .post('/api/user').send(user)
            .expect(HttpStatus.BAD_REQUEST);
        expect(response.body.message.code).toBe('invalid_dni_format');
    });

    it('It should be fail if the dni length is less than 10', async () => {

        const user: UserDTO = {
            email: 'asd@asd.com',
            password: '12345',
            firstname: 'asd',
            lastname: 'asd',
            dni: '12345678',
            role: 'Customer'
        }
        const response = await request(app.getHttpServer())
            .post('/api/user').send(user)
            .expect(HttpStatus.BAD_REQUEST);
        expect(response.body.message.code).toBe('invalid_dni_minimum_length');
    });

    it('It should be fail if the dni length is higher than 10', async () => {

        const user: UserDTO = {
            email: 'asd@asd.com',
            password: '12345',
            firstname: 'asd',
            lastname: 'asd',
            dni: '123456781212',
            role: 'Customer'
        }
        const response = await request(app.getHttpServer())
            .post('/api/user').send(user)
            .expect(HttpStatus.BAD_REQUEST);
        expect(response.body.message.code).toBe('invalid_dni_maximum_length');
    });

    it('It should be fail if the role not is a allowed role', async () => {

        const user : UserDTO = {
            email: 'asd@asd.com',
            password: '12345',
            firstname: 'asd',
            lastname: 'asd',
            dni: '1234567890',
            role: 'Administrator'
        }
        const response = await request(app.getHttpServer())
        .post('/api/user').send(user)
        .expect(HttpStatus.BAD_REQUEST);
        expect(response.body.message.code).toBe('invalid_role');
    });

    it('should be faild if the user do not exists', async () => {
        userBussinessLogicRepository.userAlreadyExists.throws(new BussinessExcp({ code: 'user_already_exists' }));

        const user: UserDTO = {
            email: 'asd@asd.com',
            password: '12345',
            firstname: 'juan',
            lastname: 'zapata',
            dni: '1234567890',
            role: 'Customer'
        }
        const resp = await request(app.getHttpServer())
            .post('/api/user').send(user)
            .expect(HttpStatus.BAD_REQUEST);
        expect(resp.body.message.code).toBe('user_already_exists');

    });




    //Update Balance
    it("It should be fail if the user don't exists", async () => {

        const user : {} = {
            balance: 1000000
        }
        userBussinessLogicRepository.userAlreadyExistsAndReturn.throws(new BussinessExcp({code: 'email_not_found'}));
        const response = await request(app.getHttpServer())
        .put('/api/user').set({userid: 1}).send(user)
        .expect(HttpStatus.BAD_REQUEST);

        expect(response.body.message.code).toBe('email_not_found');
    });

    it("It should be fail if the user exceds the balance capacity", async () => {

        const user : User = {
            userId: 1,
            email: 'asd@asd.com',
            password: '1234',
            firstname: 'asd',
            lastname: 'asd',
            dni: '1234567890',
            balance: 0,
            role: 'Customer'
        }
        userBussinessLogicRepository.userAlreadyExistsAndReturn.returns(Promise.resolve(user));
        userBussinessLogicRepository.userHaveBalance.throws(new BussinessExcp({code: 'invalid_balance'}));
        const response = await request(app.getHttpServer())
        .put('/api/user').set({userid: 1}).send(user)
        .expect(HttpStatus.BAD_REQUEST);

        expect(response.body.message.code).toBe('invalid_balance');
    });
})