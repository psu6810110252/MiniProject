import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // เปิดประตูให้ Frontend เข้ามาได้
  app.enableCors(); 
  
  await app.listen(3000);
}
bootstrap();