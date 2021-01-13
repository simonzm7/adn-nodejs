import AuthCommand from "src/application/UserAuthentication/Command/auth-command";
import { BussinessExcp } from "src/domain/Exceptions/BussinessExcp";
import { UserAuth } from "src/domain/UserActions/UserAuthentication/Model/UserAuth";
import { UserAuthenticationService } from "src/domain/UserActions/UserAuthentication/Service/UserAuthenticationService";
import { UserEntity } from "src/infraestructure/Users/Entity/user.entity";


describe('Domain - AuthUserService', () => {

    it("It should be fail if the user on authentication don't exists", async () => {
        try {
            const _userAuthenticationService: UserAuthenticationService = new UserAuthenticationService(
                {
                    userAlreadyExists: jest.fn(async (email, dni) => { }),
                    userAlreadyExistsAndReturn: jest.fn(async (email) => { throw new BussinessExcp({ code: 'email_not_found' }) }),
                }, {
                    validationPassword: jest.fn(() => {})
                });
            const user: AuthCommand = {
                email: 'asd@asd.com',
                password: '12345'
            }
            await _userAuthenticationService.executeLogin(new UserAuth({
                email: user.email,
                password: user.password
            }));
        } catch (e) {
            expect(e.response.message.code).toBe('email_not_found');
        }


    });

    it("It should be fail if the user exists but the password is incorrect", async () => {
        try {
            const _userAuthenticationService: UserAuthenticationService = new UserAuthenticationService({
                userAlreadyExists: jest.fn(async (email, dni) => { }),
                userAlreadyExistsAndReturn: jest.fn(async (email) => new UserEntity()),
              
            }, {
                validationPassword: jest.fn((credentials: UserAuth, password: string) => { throw new BussinessExcp({ code: 'invalid_password' }) })
            });
            const user: AuthCommand = {
                email: 'asd@asd.com',
                password: '12345'
            }
            await _userAuthenticationService.executeLogin(new UserAuth({
                email: user.email,
                password: user.password
            }));
        } catch (e) {
            expect(e.response.message.code).toBe('invalid_password');
        }

    });
})