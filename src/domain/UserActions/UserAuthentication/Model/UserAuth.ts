import GlobalValidations from '../../../Validations/GlobalModelValidations';

export class UserAuth {
    private readonly email: string;
    private readonly password: string;
    // 
    private readonly PASSWORD_MIN_LENGTH : number = 4;
    private readonly PASSWORD_MAX_LENGTH : number = 30;
    constructor({ email, password }) {
        this.email = email;
        this.password = password;
        this.initializeValidations();
    }
    private initializeValidations = () => {
        GlobalValidations.isEmail(this.email);
        GlobalValidations.isLength(this.password, 'password', { min: this.PASSWORD_MIN_LENGTH, max: this.PASSWORD_MAX_LENGTH });
    }
    get getEmail(): string {
        return this.email;
    }
    get getPassword(): string {
        return this.password;
    }
}