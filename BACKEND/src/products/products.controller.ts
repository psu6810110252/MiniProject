import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ProductsService } from './products.service';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express'; // ตัวดักจับไฟล์
import { diskStorage } from 'multer'; // ตัวจัดการการเซฟลงเครื่อง
import { extname } from 'path'; // ตัวดึงนามสกุลไฟล์

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  // ✅ เพิ่มใหม่: Endpoint ดึงสินค้าเฉพาะของคนขายคนนั้น (สำหรับ Seller Dashboard)
  // ต้องแน่ใจว่าใน products.service.ts มีเมธอด findByUser แล้วนะครับ
  @UseGuards(AuthGuard('jwt'))
  @Get('my-products')
  async findMyProducts(@Request() req) {
    const products = await this.productsService.findAll();
    // filter products by the authenticated user's id; adjust the property name if your product uses a different owner field
    return (products || []).filter((p: any) => p.userId === req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  // 📸 รับไฟล์รูปภาพ
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads', // เซฟลงโฟลเดอร์ uploads
      filename: (req, file, callback) => {
        // ตั้งชื่อไฟล์ใหม่เป็น "random + นามสกุลเดิม" (กันชื่อซ้ำ)
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
      },
    }),
  }))
  create(@Body() createProductDto: any, @Request() req: any, @UploadedFile() file: Express.Multer.File) {
    // ✅ แก้จุดตาย: แปลงค่า price จาก String เป็น Number (เพราะ FormData ส่งมาเป็น String)
    if (createProductDto.price) {
      createProductDto.price = Number(createProductDto.price);
    }

    // ถ้ามีไฟล์แนบมา ให้เอาชื่อไฟล์ใส่ลงไปในข้อมูลด้วย
    if (file) {
      createProductDto.image = file.filename;
    }
    return this.productsService.create(createProductDto, req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: any) {
    // ✅ เพิ่มการแปลงค่า price ตอนแก้ไขด้วย
    if (updateProductDto.price) {
      updateProductDto.price = Number(updateProductDto.price);
    }
    return this.productsService.update(+id, updateProductDto);
  }
}