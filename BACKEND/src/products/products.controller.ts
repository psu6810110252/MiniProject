import { Controller, Get, Post, Body, Param, UseGuards, Request, Delete } from '@nestjs/common';
import { ProductsService } from './products.service';
import { AuthGuard } from '@nestjs/passport'; // <--- ตัวตรวจบัตร


@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // 🔒 ต้องล็อกอินเท่านั้นถึงจะลงขายได้
  @UseGuards(AuthGuard('jwt')) 
  @Post()
  create(@Body() createProductDto: any, @Request() req: any) {
    // req.user คือข้อมูลที่แกะได้จาก Token (userId, username)
    return this.productsService.create(createProductDto, req.user);
  }

  // 🔓 ใครๆ ก็ดูรายการสินค้าได้ (ไม่ต้องล็อกอิน)
  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @UseGuards(AuthGuard('jwt')) // ต้องล็อกอินถึงจะลบได้
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}