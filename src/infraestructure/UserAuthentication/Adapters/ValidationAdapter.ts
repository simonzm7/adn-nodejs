import {Injectable } from "@nestjs/common";
import UserAuthModel from "src/domain/UserActions/UserAuthentication/Model/UserAuthModel";
import { AuthValidationRepository } from "src/domain/UserActions/UserAuthentication/Repository/AuthValidationRepository";

@Injectable()
export class ValidationsAdapter implements AuthValidationRepository {
    validation = (credentials: UserAuthModel, password: string): boolean => {
        if (credentials.getPassword === password)
            return true;

        return false;
    }
}