import { Module } from '@nestjs/common';
import { UserRegisterManagment } from 'src/application/Users/UseCases/UserRegisterManagment';
import { UserService } from 'src/domain/UserActions/Users/services/UserService';
import { UserController } from './controllers/user.controller';
import { MergeProvider, MergeDB, MergeValidations } from './MergedProviders/MergeProvider';
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from './EntityManager/user.entity';
import { BalanceService } from 'src/domain/UserActions/Users/services/BalanceService';
import { PaymentsModule } from '../Payments/payments.module';
import { UserBussinessLogic } from 'src/domain/UserActions/Users/Validations/UserBussinessLogic';



@Module({
    imports: [TypeOrmModule.forFeature([User]), PaymentsModule],
    providers: [UserRegisterManagment, UserService, BalanceService, UserBussinessLogic,MergeProvider, MergeDB, MergeValidations],
    controllers: [UserController],
    exports: [MergeDB, MergeProvider, MergeValidations]
})
export class UserModule {}