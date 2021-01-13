import { Module } from '@nestjs/common';
import { UserModule } from './Users/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentModule } from './Appointments/appointment.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { databaseConfigFactory } from './Configuration/Database/config';
import { PaymentsModule } from './Payments/payments.module';
import { AppLogger } from './Configuration/Logger/AppLogger';
import { TrmModule } from './TRM/trm.module';
import {AuthModule} from './UserAuthentication/auth.module';
@Module({
  imports: [AppLogger, UserModule, AuthModule, AppointmentModule, PaymentsModule, TrmModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: databaseConfigFactory,
      inject: [ConfigService]
    }), ConfigModule.forRoot({
      isGlobal: true
    })]
})
export class InfraestructureModel { }
