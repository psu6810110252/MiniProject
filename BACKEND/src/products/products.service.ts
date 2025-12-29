import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  // 1. สร้างสินค้า
  async create(createProductDto: any, user: any) {
    const newProduct = this.productsRepository.create({
      ...createProductDto,
      user: { id: user.id } as any,
    });
    return this.productsRepository.save(newProduct);
  }

  // 2. ดึงทั้งหมด
  findAll() {
    return this.productsRepository.find();
  }

  // 3. ดึงชิ้นเดียว
  findOne(id: number) {
    return this.productsRepository.findOne({ 
      where: { id },
      relations: ['user'] 
    });
  }

  // 4. ลบสินค้า
  async remove(id: number) {
    return this.productsRepository.delete(id);
  }

  // 5. อัปเดตสินค้า (ต้องมีอันนี้!)
  async update(id: number, updateProductDto: any) {
    return this.productsRepository.update(id, updateProductDto);
  }
}