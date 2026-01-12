import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express'; // 1. import นี้
import { join } from 'path'; // 2. import นี้

async function bootstrap() {
  // 3. เพิ่ม <NestExpressApplication> ตรงนี้
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors();

 // ✅ ของใหม่ (ใช้ process.cwd() แทน):
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });

  await app.listen(3000);
}
bootstrap();