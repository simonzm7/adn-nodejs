import { Module } from '@nestjs/common';
import { QueryUser } from 'src/application/UserAuthentication/Query/query-user-handler';
import UserLoginManagement from 'src/application/UserAuthentication/Command/auth-user-handler';
import { UserAuthenticationService } from 'src/domain/UserActions/UserAuthentication/Service/UserAuthenticationService';
import { UserModule } from '../Users/user.module';
import UserAuthenticationController from './Controllers/auth.controller';
import { MergeDaoAdapter } from './providers/dao/dao-auth.provider';
import { DaoUserProvider } from '../Users/Providers/dao/dao-user.provider';

@Module({
    imports: [UserModule],
    controllers: [UserAuthenticationController],
    providers: [UserLoginManagement, UserAuthenticationService,
        QueryUser, MergeDaoAdapter, DaoUserProvider]
})
export default class UserAuthenticationModule { }