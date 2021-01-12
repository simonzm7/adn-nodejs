import { Module } from "@nestjs/common";
import { QueryUser } from "src/application/UserAuthentication/UsesCases/Query/QueryUser";
import UserLoginManagement from "src/application/UserAuthentication/UsesCases/Command/UserLoginManagement";
import UserAuthenticationService from "src/domain/UserActions/UserAuthentication/Service/UserAuthenticationService";
import { UserModule } from "../Users/user.module";
import UserAuthenticationController from "./Controllers/auth.controller";
import { MergeRepository, MergeValidations, mergeQuery } from "./MergeProviders/MergeProviders";


@Module({
    imports: [UserModule],
    controllers: [UserAuthenticationController],
    providers: [UserLoginManagement, UserAuthenticationService,
        QueryUser,MergeRepository, MergeValidations, mergeQuery]
})
export default class UserAuthenticationModule {}