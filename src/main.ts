import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { dynamicCorsOptions } from './common/middleware/cors.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors(dynamicCorsOptions);
  app.setGlobalPrefix('api/v1');
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = Number(process.env.PORT || 3000);
  await app.listen(port);
  console.log(`Petshop SaaS API running at http://localhost:${port}/api/v1`);
}

void bootstrap();
