import { NestFactory } from '@nestjs/core';
import { type NestExpressApplication } from '@nestjs/platform-express';
import { json, urlencoded } from 'express';
import { ZodValidationPipe } from 'nestjs-zod';
import fs from 'fs';
import { join } from 'path';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });
  app.useGlobalPipes(new ZodValidationPipe());

  // Increase payload size limit
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  // Serve the uploads directory statically
  const uploadsDir = join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  app.useStaticAssets(uploadsDir, {
    prefix: '/uploads/',
  });

  await app.listen(process.env.PORT ?? 3002);
}

bootstrap().catch((err) => {
  console.error('API Bootstrap Error:', err);
});
// Triggering recompile for new endpoints
