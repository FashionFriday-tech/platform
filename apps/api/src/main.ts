import { NestFactory } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ZodValidationPipe());

  await app.listen(process.env.PORT ?? 3001);
}

bootstrap().catch((err) => {
  console.error('API Bootstrap Error:', err);
});
// Triggering recompile for new endpoints
