import { Module } from '@nestjs/common';
import { UserService } from 'src/domain/UserActions/Users/services/UserService';
import { UserController } from './controllers/user.controller';
import {
    MergeCredentialsRepository, 
    MergeOperationsRepository, 
    MergeUserValidations, 
     } from './Providers/Validations/validations.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './Entity/user.entity';
import { BalanceService } from 'src/domain/UserActions/Users/services/BalanceService';
import { PaymentsModule } from '../Payments/payments.module';
import { UserHandler } from 'src/application/Users/Command/user-hander';
import { DaoUserProvider } from './Providers/dao/dao-user.provider';
import { RepositoryUserProvider } from './Providers/repository/repository-user.provider';



@Module({
    imports: [TypeOrmModule.forFeature([UserEntity]), PaymentsModule],
    providers: [UserHandler, UserService, BalanceService, DaoUserProvider,
        MergeCredentialsRepository, 
        MergeOperationsRepository, 
        MergeUserValidations, 
        RepositoryUserProvider],
    controllers: [UserController],
    exports: [MergeCredentialsRepository, MergeUserValidations,TypeOrmModule.forFeature([UserEntity])]
})
export class UserModule {}
