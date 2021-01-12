import { Module } from '@nestjs/common';
import { UserModule } from './Users/user.module';
import { TypeOrmModule } from "@nestjs/typeorm";
import UserAuthenticationModule from './UserAuthentication/auth.module';
import { AppointmentModule } from './Appointments/appointment.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { dbConfiguration } from './Configuration/Database/config';
import { PaymentsModule } from './Payments/payments.module';
import { TrmModule } from './TRM/trm.module';
import { AppLogger } from './Configuration/Logger/AppLogger';
@Module({
    imports:[AppLogger,UserModule,UserAuthenticationModule,AppointmentModule, PaymentsModule, TrmModule,
      TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: dbConfiguration,
      inject: [ConfigService]
    }), ConfigModule.forRoot({
        isGlobal: true
      })]
})
export class InfraestructureModel{}