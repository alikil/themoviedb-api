import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';

import { AllExceptionsFilter } from './all-exception.filter';
import { AppModule } from './app.module';
import { enableCors, useDocumentation, useMiddlewares } from './plugins';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  enableCors(app);
  useMiddlewares(app);
  useDocumentation(app);
  app.useGlobalFilters(new AllExceptionsFilter());

  const port = process.env.PORT || 8006;
  await app.listen(port);
}
bootstrap();
