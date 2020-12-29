import { HttpStatus, Injectable } from "@nestjs/common";
import ExceptionRepository from "src/domain/Exceptions/Repository/ExceptionRepository";
import { ValidationsRepository } from "src/domain/Users/repositories/Validations/ValidationsRepository";
import { User } from "src/infraestructure/Users/EntityManager/user.entity";
import UserAuthModel from "../Model/UserAuthModel";
import { AuthValidationRepository } from "../Repository/AuthValidationRepository";
import { LoginRepository } from "../Repository/LoginRepository";

@Injectable()
export default class UserAuthenticationService {
    constructor(private readonly loginRepository: LoginRepository,
        private readonly validationRepository: ValidationsRepository,
        private readonly authValidationRepository: AuthValidationRepository
    ) { }
    ExecuteLogin = async (credentials: UserAuthModel): Promise<{}> => {
        return new Promise(async (resolve, reject) => {
            const userEntity: User = await this.validationRepository.UserAlreadyExistsAndReturn(credentials.getEmail);
            if (userEntity) {
                if (this.authValidationRepository.validation(credentials, userEntity.password))
                   resolve(this.loginRepository.LoginUser(userEntity.userId));
                else
                reject({message: 'Contraseña incorrecta', statusCode: HttpStatus.BAD_REQUEST});
            }
            else
                reject({message: 'El usuario no existe', statusCode: HttpStatus.BAD_REQUEST});
        })
    }
}