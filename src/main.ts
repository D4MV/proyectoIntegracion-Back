import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // <-- ¿Está este import?

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Esta es la línea más importante para tu problema
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  app.enableCors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
