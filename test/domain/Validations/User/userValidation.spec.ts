import { UserDto } from "src/application/UserAuthentication/Query/DTO/user.dto"
import { UserValidations } from "src/domain/UserActions/Users/Validations/UserValidations"
import { UserEntity } from "src/infraestructure/Users/Entity/user.entity"



describe('User Validation Test', () => {


    it('should be fail if user already exists', async () => {
        try {
            const user: UserEntity = {
                userId: 1,
                email: '',
                password: '',
                firstname: '',
                lastname: '',
                dni: '',
                balance: 0,
                role: 'Customer'
            }
            const _userValidations : UserValidations= new UserValidations({
                findOneByEmailAndDni: jest.fn(async () => user),
                findOneByEmail: jest.fn(async () => new UserEntity()),
                findOneByEmailOrId: jest.fn(async () => new UserEntity()),
                findOneById: jest.fn(() => { }),
                findAndSelect: jest.fn(async () => new UserDto())
            });

            await _userValidations.userAlreadyExists('', '');
        } catch (e) { 
            expect(e.response.message.code).toBe('user_already_exists');
        }

    });


    it('should be fail if user do not exists', async () => {
        try {

            const _userValidations : UserValidations= new UserValidations({
                findOneByEmailAndDni: jest.fn(async () => new UserEntity()),
                findOneByEmail: jest.fn(async () => new UserEntity()),
                findOneByEmailOrId: jest.fn(async () => null),
                findOneById: jest.fn(() => { }),
                findAndSelect: jest.fn(async () => new UserDto())
            });

            await _userValidations.userAlreadyExistsAndReturn('');
        } catch (e) { 
            expect(e.response.message.code).toBe('email_not_found');
        }

    });
})