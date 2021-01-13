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
        const PASSWORD_MIN_LENGTH : number = 4;
        const PASSWORD_MAX_LENGTH : number = 30;
        const DNI_MIN_AND_MAX_LENGTH : number = 10;
        GlobalValidations.isEmail(this.email);
        GlobalValidations.isLength(this.password, 'password', {min: PASSWORD_MIN_LENGTH, max: PASSWORD_MAX_LENGTH});
        GlobalValidations.isString(this.firstname, 'firstname');
        GlobalValidations.isString(this.lastname, 'lastname');
        GlobalValidations.isNumber('dni', this.dni);
        GlobalValidations.isLength(this.dni, 'dni', {min: DNI_MIN_AND_MAX_LENGTH, max: DNI_MIN_AND_MAX_LENGTH});
        GlobalValidations.isRole(this.role);
    };
    get get_email(): string {
        return this.email;
    };
    get get_password(): string {
        return this.password;
    };
    get get_first_name(): string {
        return this.firstname;
    };
    get get_last_name(): string {
        return this.lastname;
    };
    get get_role(): string {
        return this.role;
    };
    get get_dni(): string {
        return this.dni;
    };
}
