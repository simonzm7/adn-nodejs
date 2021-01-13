import { UserAuth } from "src/domain/UserActions/UserAuthentication/Model/UserAuth";
import { CredentialsValidations } from "src/domain/UserActions/Users/Validations/CredentialsValidations"




describe('User Credential Validations Test', () => {

    it('it shoudl be fail if the password is incorrect', () => {
        try {
            const _credentialsValidation : CredentialsValidations= new CredentialsValidations();
            const userAuth: UserAuth = new UserAuth({
                email: 'asd@asd.com',
                password: '123412'
            });
            _credentialsValidation.validationPassword(userAuth, 'addw');
        } catch (e) {
            expect(e.response.message.code).toBe('invalid_password');
        }
    })
})