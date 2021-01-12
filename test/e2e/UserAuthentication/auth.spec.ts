import * as request from 'supertest';
import { Test } from "@nestjs/testing";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { createSandbox, SinonStubbedInstance } from "sinon";
import UserLoginManagement from "src/application/UserAuthentication/UsesCases/Command/UserLoginManagement";
import UserAuthenticationService from "src/domain/UserActions/UserAuthentication/Service/UserAuthenticationService";
import { LoginRepository } from "src/domain/UserActions/UserAuthentication/Repository/LoginRepository";
import { createStubObj } from "test/util/createObjectStub";
import UserAuthenticationController from "src/infraestructure/UserAuthentication/Controllers/auth.controller";
import LoginDTO from "src/domain/UserActions/UserAuthentication/Repository/DTO/LoginDTO";
import { User } from "src/infraestructure/Users/EntityManager/user.entity";
import { AuthValidationRepository } from 'src/domain/UserActions/UserAuthentication/Repository/AuthValidationRepository';
import { BussinessExcp } from 'src/domain/Exceptions/BussinessExcp';
import { QueryRepository } from 'src/domain/UserActions/UserAuthentication/Repository/QueryRepository';
import { QueryUser } from 'src/application/UserAuthentication/UsesCases/Query/QueryUser';
import { UserBussinessLogicRepository } from 'src/domain/UserActions/Users/repositories/Users/UserBussinessLogicRepository';

const authSandbox = createSandbox();
describe('UserAuthenticationController', () => {
    let app: INestApplication;
    let loginRepository: SinonStubbedInstance<LoginRepository>;
    let authValidationRepository: SinonStubbedInstance<AuthValidationRepository>;
    let queryRepository: SinonStubbedInstance<QueryRepository>;
    let userBussinessLogicRepository: SinonStubbedInstance<UserBussinessLogicRepository>;
    beforeAll(async () => {
        loginRepository = createStubObj<LoginRepository>(['LoginUser'], authSandbox);

        authValidationRepository = createStubObj<AuthValidationRepository>(['validation'], authSandbox);
        queryRepository = createStubObj<QueryRepository>(['getUser'], authSandbox);

        userBussinessLogicRepository = createStubObj<UserBussinessLogicRepository>(
            ['userAlreadyExists', 'userAlreadyExistsAndReturn', 'userHaveBalance', 'validationPassword'], authSandbox);

        const moduleRef = await Test.createTestingModule({
            controllers: [UserAuthenticationController],
            providers: [UserLoginManagement, UserAuthenticationService, QueryUser,
                { provide: LoginRepository, useValue: loginRepository },
                { provide: QueryRepository, useValue: queryRepository },
                { provide: AuthValidationRepository, useValue: authValidationRepository },
                { provide: UserBussinessLogicRepository, useValue: userBussinessLogicRepository }
            ]
        }).compile();

        app = moduleRef.createNestApplication();
        await app.init();
    })
    afterEach(() => authSandbox.restore());
    afterAll(async () => await app.close());

    it('It should be fail if the user email is in a invalid format', async () => {

        const user: LoginDTO = {
            email: 'user@@asd.com',
            password: '12345'
        }
        const resp = await request(app.getHttpServer())
            .post('/api/auth').send(user)
            .expect(HttpStatus.BAD_REQUEST);
        expect(resp.body.message).toEqual(['email must be an email'])
    });

    it('It should be fail if the user minimum length is less than 4', async () => {

        const user: LoginDTO = {
            email: 'user@asd.com',
            password: '123'
        }
        const resp = await request(app.getHttpServer())
            .post('/api/auth').send(user)
            .expect(HttpStatus.BAD_REQUEST);
        expect(resp.body.message.code).toEqual('invalid_password_minimum_length')
    });

    it('It should be fail if the user minimum length is higher than 4', async () => {

        const user: LoginDTO = {
            email: 'user@asd.com',
            password: '1234567890123456789012345678901'
        }
        const resp = await request(app.getHttpServer())
            .post('/api/auth').send(user)
            .expect(HttpStatus.BAD_REQUEST);
        expect(resp.body.message.code).toEqual('invalid_password_maximum_length')
    });




    it('It should be fail if the user don´t exists', async () => {

        const USER: LoginDTO = {
            email: 'nonexistuser@mail.com',
            password: '1234'
        }
        userBussinessLogicRepository.userAlreadyExistsAndReturn.throws(() => {
            throw new BussinessExcp({ code: 'email_not_found' })
        });
        const resp = await request(app.getHttpServer())
            .post('/api/auth').send(USER)
            .expect(HttpStatus.BAD_REQUEST);
        expect(resp.body.message.code).toBe('email_not_found')
    });

    it('It should be fail if the user exists, but the password is incorrect', async () => {

        const user: LoginDTO = {
            email: 'user@asd.com',
            password: '12345'
        }
        const userModel: User = {
            userId: 1,
            email: 'asd@asd.com',
            password: '12345',
            firstname: 'firstname',
            lastname: 'lastname',
            dni: '1234567890',
            balance: 1000000,
            role: 'Customer'
        }
        userBussinessLogicRepository.userAlreadyExistsAndReturn.returns(Promise.resolve(userModel));
        userBussinessLogicRepository.validationPassword.throws(() => {
            throw new BussinessExcp({ code: 'invalid_password' });
        });
        const resp = await request(app.getHttpServer())
            .post('/api/auth').send(user)
            .expect(HttpStatus.BAD_REQUEST);
        expect(resp.body.message.code).toBe('invalid_password')
    });
})