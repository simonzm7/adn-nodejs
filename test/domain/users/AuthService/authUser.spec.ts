import { BussinessExcp } from "src/domain/Exceptions/BussinessExcp";
import UserAuthModel from "src/domain/UserActions/UserAuthentication/Model/UserAuthModel";
import LoginDTO from "src/domain/UserActions/UserAuthentication/Repository/DTO/LoginDTO";
import UserAuthenticationService from "src/domain/UserActions/UserAuthentication/Service/UserAuthenticationService";
import { User } from "src/infraestructure/Users/EntityManager/user.entity";


describe('Domain - AuthUserService', () => {

    it("It should be fail if the user on authentication don't exists", async () => {
        try {
            const _userAuthenticationService: UserAuthenticationService = new UserAuthenticationService(null,
                {
                    userAlreadyExists: jest.fn(async (email, dni) => { }),
                    userAlreadyExistsAndReturn: jest.fn(async (email) => { throw new BussinessExcp({ code: 'email_not_found' }) }),
                    userHaveBalance: jest.fn(async (balance: number, userBalance: number) => { }),
                    validationPassword: jest.fn((credentials: UserAuthModel, password: string) => { })
                });
            const user: LoginDTO = {
                email: 'asd@asd.com',
                password: '12345'
            }
            await _userAuthenticationService.executeLogin(new UserAuthModel({
                email: user.email,
                password: user.password
            }));
        } catch (e) {
            expect(e.response.message.code).toBe('email_not_found');
        }


    });

    it("It should be fail if the user exists but the password is incorrect", async () => {
        try {
            const _userAuthenticationService: UserAuthenticationService = new UserAuthenticationService(null, {
                userAlreadyExists: jest.fn(async (email, dni) => { }),
                userAlreadyExistsAndReturn: jest.fn(async (email) => new User()),
                userHaveBalance: jest.fn((balance: number, userBalance: number) => { }),
                validationPassword: jest.fn((credentials: UserAuthModel, password: string) => { throw new BussinessExcp({ code: 'invalid_password' }) })
            });
            const user: LoginDTO = {
                email: 'asd@asd.com',
                password: '12345'
            }
            await _userAuthenticationService.executeLogin(new UserAuthModel({
                email: user.email,
                password: user.password
            }));
        } catch (e) {
            expect(e.response.message.code).toBe('invalid_password');
        }

    });
})