import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Onix NodeJS Internship 2022')
    .setDescription('The server API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('swagger-docs', app, document);

  await app.listen(3000);
}
bootstrap();
