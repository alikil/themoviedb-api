import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser = require('cookie-parser');
import * as express from 'express';
import helmet from 'helmet';

export const enableCors = (app: INestApplication) => {
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'OPTIONS', 'DELETE', 'PATCH'],
    allowedHeaders: [
      'Accept',
      'Authorization',
      'Content-Disposition',
      'Content-Type',
      'Origin',
      'X-Requested-With',
    ],
    exposedHeaders: ['Content-Disposition', 'Authorization'],
  });
};

export const useDocumentation = (app: INestApplication) => {
  const options = new DocumentBuilder()
    .setTitle('TestTask')
    .setDescription('TestTask Description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/api/docs', app, document);
};

export const useMiddlewares = (app: INestApplication) => {
  app.use(cookieParser());
  app.use(helmet());
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));
};
