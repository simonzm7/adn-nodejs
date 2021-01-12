import GlobalModelValidations from "../../../Validations/GlobalModelValidations";

interface IAuthModel {
    email : string;
    password: string;
}
export default class UserAuthModel {
    private readonly email : string;
    private readonly password :string;

    constructor({ email, password }:IAuthModel) {
        this.email = email;
        this.password = password;
        this.initializeValidations();
    }
    private initializeValidations = () => {
        GlobalModelValidations.isEmail(this.email);
        GlobalModelValidations.isLength(this.password, 'password', { min: 4, max: 30 });
    }
    get getEmail(): string {
        return this.email;
    }
    get getPassword(): string {
        return this.password;
    }
}