import GlobalValidations from '../../../Validations/GlobalModelValidations';


export class User {

    private readonly email: string;
    private readonly password: string;
    private readonly firstname: string;
    private readonly lastname: string;
    private readonly dni: string;
    private readonly role: string;
    

    constructor({ email, password, firstname, lastname, dni, role }) {
        this.email = email;
        this.password = password;
        this.firstname = firstname;
        this.lastname = lastname;
        this.dni = dni;
        this.role = role;

        this.initializeValidations();
    }
    private initializeValidations = () => {
        const PASSWORD_MIN_LENGTH  = 4;
        const PASSWORD_MAX_LENGTH = 30;
        const DNI_MIN_AND_MAX_LENGTH = 10;
        GlobalValidations.isEmail(this.email);
        GlobalValidations.isLength(this.password, 'password', {min: PASSWORD_MIN_LENGTH, max: PASSWORD_MAX_LENGTH});
        GlobalValidations.isString(this.firstname, 'firstname');
        GlobalValidations.isString(this.lastname, 'lastname');
        GlobalValidations.isNumber('dni', this.dni);
        GlobalValidations.isLength(this.dni, 'dni', {min: DNI_MIN_AND_MAX_LENGTH, max: DNI_MIN_AND_MAX_LENGTH});
        GlobalValidations.isRole(this.role);
    };
    get getEmail(): string {
        return this.email;
    };
    get getPassword(): string {
        return this.password;
    };
    get getFirstName(): string {
        return this.firstname;
    };
    get getLastName(): string {
        return this.lastname;
    };
    get getRole(): string {
        return this.role;
    };
    get getDni(): string {
        return this.dni;
    };
}
