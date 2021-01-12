import { BussinessExcp } from "src/domain/Exceptions/BussinessExcp";
import { UserDTO } from "../repositories/Users/DTO/UserDTO";
import { IMethods } from "../repositories/Validations/IMethods";
import UserModelValidations from "../../../Validations/GlobalModelValidations";

interface IUserModel {
    email: string;
    password: string;
    firstname: string;
    lastname: string;
    dni: string;
    role: string;
}
export class UserModel {

    private readonly email: string;
    private readonly password: string;
    private readonly firstname: string;
    private readonly lastname: string;
    private readonly dni: string;
    private readonly role: string;
    constructor({ email, password, firstname, lastname, dni, role }: IUserModel) {
        this.email = email;
        this.password = password;
        this.firstname = firstname;
        this.lastname = lastname;
        this.dni = dni;
        this.role = role;

        this.initializeValidations();
    }
    private initializeValidations = () => {
        UserModelValidations.isEmail(this.email);
        UserModelValidations.isLength(this.password, 'password', {min: 4, max: 30});
        UserModelValidations.isString(this.firstname, 'firstname');
        UserModelValidations.isString(this.lastname, 'lastname');
        UserModelValidations.isNumber('dni', this.dni);
        UserModelValidations.isLength(this.dni, 'dni', {min: 10, max: 10});
        UserModelValidations.isRole(this.role);
    }
    get get_email(): string {
        return this.email;
    }
    get get_password(): string {
        return this.password;
    }
    get get_first_name(): string {
        return this.firstname;
    }
    get get_last_name(): string {
        return this.lastname;
    }
    get get_role(): string {
        return this.role;
    }
    get get_dni(): string {
        return this.dni;
    }
}