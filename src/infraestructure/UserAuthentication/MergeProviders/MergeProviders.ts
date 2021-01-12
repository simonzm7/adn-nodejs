import {AuthValidationRepository} from "src/domain/UserActions/UserAuthentication/Repository/AuthValidationRepository";
import { LoginRepository } from "src/domain/UserActions/UserAuthentication/Repository/LoginRepository";
import { QueryRepository } from "src/domain/UserActions/UserAuthentication/Repository/QueryRepository";
import { LoginAdapter } from "../Adapters/LoginAdapter";
import { QueryAdapter } from "../Adapters/QueryAdapter";
import { ValidationsAdapter } from "../Adapters/ValidationAdapter";

export const MergeRepository = {
    provide: LoginRepository,
    useClass: LoginAdapter
}
export const MergeValidations = {
    provide: AuthValidationRepository,
    useClass: ValidationsAdapter
}

export const mergeQuery = {
    provide: QueryRepository,
    useClass: QueryAdapter
}