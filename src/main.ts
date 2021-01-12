import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppLogger } from './infraestructure/Configuration/Logger/AppLogger';
import { HttpExceptionFilter } from './infraestructure/Exceptions/HttpExceptionFilter';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      credentials: true,
      origin: '*'
    }
  });
  const logger = await app.resolve(AppLogger);
  app.useGlobalFilters(new HttpExceptionFilter(logger));
  const _configService = app.get(ConfigService);
  await app.listen(_configService.get('PORT'));
}
bootstrap();
