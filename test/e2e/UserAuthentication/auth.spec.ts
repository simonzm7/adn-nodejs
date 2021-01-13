import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { createSandbox, SinonStubbedInstance } from 'sinon';
import AuthUserHandler from 'src/application/UserAuthentication/Command/auth-user-handler';
import { createStubObj } from 'test/util/createObjectStub';
import { AuthController } from 'src/infraestructure/UserAuthentication/Controllers/auth.controller';
import { BussinessExcp } from 'src/domain/Exceptions/BussinessExcp';
import { QueryUser } from 'src/application/UserAuthentication/Query/query-user-handler';
import { UserAuthenticationService } from 'src/domain/UserActions/UserAuthentication/Service/UserAuthenticationService';
import { DaoAuth } from 'src/domain/UserActions/UserAuthentication/port/dao/dao-auth';
import { UsersValidationsRepository } from 'src/domain/UserActions/Users/port/Validations/repository/user-validations-repository';
import { CredentialsValidationsRepository } from 'src/domain/UserActions/Users/port/Validations/repository/credentials-validations-repository';
import AuthCommand from 'src/application/UserAuthentication/Command/auth-command';
import { UserEntity } from 'src/infraestructure/Users/Entity/user.entity';

const authSandbox = createSandbox();
describe('UserAuthenticationController', () => {
    let app: INestApplication;
    let daoAuth: SinonStubbedInstance<DaoAuth>;
    let userValidationRepository: SinonStubbedInstance<UsersValidationsRepository>;
    let credentialsValidationsRepository: SinonStubbedInstance<CredentialsValidationsRepository>;
    beforeAll(async () => {
        daoAuth = createStubObj<DaoAuth>(['getUser'], authSandbox);
        userValidationRepository = createStubObj<UsersValidationsRepository>(
            ['userAlreadyExists', 'userAlreadyExistsAndReturn'], authSandbox);
        credentialsValidationsRepository = createStubObj<CredentialsValidationsRepository>(
            ['validationPassword'],authSandbox);

        const moduleRef = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [AuthUserHandler, UserAuthenticationService, QueryUser,
                { provide: DaoAuth, useValue: daoAuth },
                {provide: UsersValidationsRepository,useValue: userValidationRepository},
                {provide:CredentialsValidationsRepository ,useValue: credentialsValidationsRepository}
            ]
        }).compile();

        app = moduleRef.createNestApplication();
        await app.init();
    })
    afterEach(() => authSandbox.restore());
    afterAll(async () => await app.close());

    it('It should be fail if the user email is in a invalid format', async () => {

        const user: AuthCommand = {
            email: 'user@@asd.com',
            password: '12345'
        }
        const resp = await request(app.getHttpServer())
            .post('/api/auth').send(user)
            .expect(HttpStatus.BAD_REQUEST);
        expect(resp.body.message).toEqual(['email must be an email'])
    });

    it('It should be fail if the user minimum length is less than 4', async () => {

        const user: AuthCommand = {
            email: 'user@asd.com',
            password: '123'
        }
        const resp = await request(app.getHttpServer())
            .post('/api/auth').send(user)
            .expect(HttpStatus.BAD_REQUEST);
        expect(resp.body.message.code).toEqual('invalid_password_minimum_length')
    });

    it('It should be fail if the user minimum length is higher than 4', async () => {

        const user: AuthCommand = {
            email: 'user@asd.com',
            password: '1234567890123456789012345678901'
        }
        const resp = await request(app.getHttpServer())
            .post('/api/auth').send(user)
            .expect(HttpStatus.BAD_REQUEST);
        expect(resp.body.message.code).toEqual('invalid_password_maximum_length')
    });




    it('It should be fail if the user don´t exists', async () => {

        const USER: AuthCommand = {
            email: 'nonexistuser@mail.com',
            password: '1234'
        }
        userValidationRepository.userAlreadyExistsAndReturn.throws(() => {
            throw new BussinessExcp({ code: 'email_not_found' })
        });
        const resp = await request(app.getHttpServer())
            .post('/api/auth').send(USER)
            .expect(HttpStatus.BAD_REQUEST);
        expect(resp.body.message.code).toBe('email_not_found')
    });

    it('It should be fail if the user exists, but the password is incorrect', async () => {

        const user: AuthCommand = {
            email: 'user@asd.com',
            password: '12345'
        }
        const userModel: UserEntity = {
            userId: 1,
            email: 'asd@asd.com',
            password: '12345',
            firstname: 'firstname',
            lastname: 'lastname',
            dni: '1234567890',
            balance: 1000000,
            role: 'Customer'
        }
        userValidationRepository.userAlreadyExistsAndReturn.returns(Promise.resolve(userModel));
        credentialsValidationsRepository.validationPassword.throws(() => {
            throw new BussinessExcp({ code: 'invalid_password' });
        });
        const resp = await request(app.getHttpServer())
            .post('/api/auth').send(user)
            .expect(HttpStatus.BAD_REQUEST);
        expect(resp.body.message.code).toBe('invalid_password')
    });
})