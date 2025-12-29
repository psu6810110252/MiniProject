import { Controller, Post, Body, UseGuards, Request, Get, UseInterceptors, UploadedFile, Param, Patch } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { SetMetadata } from '@nestjs/common';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // 🛒 API สั่งซื้อ + แนบสลิป
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        callback(null, `slip-${uniqueSuffix}${ext}`); // ตั้งชื่อไฟล์ว่า slip-xxxx.jpg
      },
    }),
  }))
  create(@Request() req, @Body('productId') productId: number, @UploadedFile() file: Express.Multer.File) {
    // ส่งทั้ง UserID, ProductID, และ ชื่อไฟล์สลิป ไปให้ Service
    const slipFileName = file ? file.filename : undefined;
    return this.ordersService.create(req.user.id, +productId, slipFileName);
  }

  // 📜 ดูประวัติ
  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll(@Request() req) {
    return this.ordersService.findAll(req.user.id);
  }
  @UseGuards(AuthGuard('jwt'))
  @SetMetadata('roles', ['admin']) 
  @Get('admin/all')
  findAllAdmin() {
  return this.ordersService.findAllAdmin();
  }
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id/approve')
  approve(@Param('id') id: string) {
  return this.ordersService.approve(+id);
  }
}