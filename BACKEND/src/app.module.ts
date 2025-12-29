import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module'; // <--- 1. เพิ่มบรรทัดนี้
import { User } from './users/entities/user.entity';
import { Product } from './products/entities/product.entity';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [User, Product],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    ProductsModule, // <--- 2. อย่าลืมใส่ในนี้! (ถ้าขาดบรรทัดนี้ API จะ 404)
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}