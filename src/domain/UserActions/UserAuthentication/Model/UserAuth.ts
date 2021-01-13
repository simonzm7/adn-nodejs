import GlobalValidations from '../../../Validations/GlobalModelValidations';

export class UserAuth {
    private readonly email: string;
    private readonly password: string;

    constructor({ email, password }) {
        this.email = email;
        this.password = password;
        this.initializeValidations();
    }
    private initializeValidations = () => {
        const PASSWORD_MIN_LENGTH : number = 4;
        const PASSWORD_MAX_LENGTH : number = 30;
        GlobalValidations.isEmail(this.email);
        GlobalValidations.isLength(this.password, 'password', { min: PASSWORD_MIN_LENGTH, max: PASSWORD_MAX_LENGTH });
    };
    get getEmail(): string {
        return this.email;
    };
    get getPassword(): string {
        return this.password;
    };
}
