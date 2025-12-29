import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module'; // <--- 1. เพิ่ม OrdersModule

import { User } from './users/entities/user.entity';
import { Product } from './products/entities/product.entity';
import { Order } from './orders/order.entity';          // <--- 2. เพิ่ม Order (ชี้ตรงไปที่โฟลเดอร์ orders)
import { OrderItem } from './orders/order-item.entity'; // <--- 3. เพิ่ม OrderItem (ชี้ตรงไปที่โฟลเดอร์ orders)

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [User, Product, Order, OrderItem], // <--- 4. อย่าลืมใส่ Order และ OrderItem ในนี้
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    ProductsModule,
    OrdersModule, // <--- 5. ใส่ OrdersModule เพื่อให้ API ทำงาน
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}