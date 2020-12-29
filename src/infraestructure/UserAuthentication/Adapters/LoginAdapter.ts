import { HttpStatus, Injectable } from "@nestjs/common";
import { LoginRepository } from "src/domain/UserAuthentication/Repository/LoginRepository";

@Injectable()
export class LoginAdapter implements LoginRepository{
    LoginUser = (userId : number) : Promise<{}> => {
        return Promise.resolve({message: {message: 'Sesion Iniciada', userId}, statusCode: HttpStatus.OK});
    }
}