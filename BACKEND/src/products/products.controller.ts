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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  // 📸 ส่วนที่แก้: รับไฟล์รูปภาพ
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
    return this.productsService.update(+id, updateProductDto);
  }
}