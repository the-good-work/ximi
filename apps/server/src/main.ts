import { NestFactory } from '@nestjs/core';
import { raw } from 'express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { NestExpressApplication } from '@nestjs/platform-express';

config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {});
  app.use(raw({ type: 'application/webhook+json' }));

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('XIMI')
    .setDescription('The XIMI API specification')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.port || 4000);
}

bootstrap();
