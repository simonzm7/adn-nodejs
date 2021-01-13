import { ConfigService } from '@nestjs/config';



export const databaseConfigFactory : any= (configService: ConfigService) => ({
    type: 'mysql',
    host: configService.get<string>('DB_HOST'),
    port: 3306,
    username: configService.get<string>('DB_USERNAME'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_DATABASE'),
    entities: ['dist/**/*.entity{.ts,.js}'],
    synchronize: true,
    
});
