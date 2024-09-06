import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { json, urlencoded } from 'express';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './utils/global/global.exception';

function getPort(mode: string) {
  if (mode == 'production') {
    return 3434;
  }

  if (mode == 'development') {
    return 3535;
  }

  if (mode == 'final') {
    return 2424;
  }

  if (mode == 'online') {
    return 2626;
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.setGlobalPrefix('api', {
    exclude: ['/'],
  });

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  app.useGlobalFilters(new GlobalExceptionFilter(app.get(HttpAdapterHost)));
  await app.listen(getPort(process.env.MODE));
}
bootstrap();
