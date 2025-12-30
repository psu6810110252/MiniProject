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

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        callback(null, `slip-${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
  }))
  create(@Request() req, @Body('productId') productId: number, @UploadedFile() file: Express.Multer.File) {
    const slipFileName = file ? file.filename : undefined;
    return this.ordersService.create(req.user.id, +productId, slipFileName);
  }

  // 🔥 เพิ่ม Endpoint สำหรับรับข้อมูลตะกร้าสินค้า
  @UseGuards(AuthGuard('jwt'))
  @Post('bulk')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        callback(null, `slip-bulk-${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
  }))
  async createBulk(@Request() req, @Body('items') itemsString: string, @UploadedFile() file: Express.Multer.File) {
    const items = JSON.parse(itemsString); // แปลง JSON String กลับเป็น Array
    const slipFileName = file ? file.filename : undefined;
    return this.ordersService.createBulk(req.user.id, items, slipFileName);
  }

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

  @UseGuards(AuthGuard('jwt'))
@Get('payouts/my')
async getMyPayouts(@Request() req) {
  // ต้องสร้างฟังก์ชัน getMyPayouts ใน OrdersService เพื่อดึงข้อมูลจาก Repository ของ Payout
  return this.ordersService.getMyPayouts(req.user.id);
}
}