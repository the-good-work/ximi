import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { config } from 'dotenv';

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('XIMI')
    .setDescription('The XIMI API specification')
    .setVersion('1.0')
    .addTag('ximi')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.port || 4000);
}

bootstrap();
