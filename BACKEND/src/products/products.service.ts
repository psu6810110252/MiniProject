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

  async create(createProductDto: any, user: any) {
    const newProduct = this.productsRepository.create({
      ...createProductDto,
      user: { id: user.id } as any, // ผูก User กับสินค้า
    });
    return this.productsRepository.save(newProduct);
  }

  findAll() {
    return this.productsRepository.find({
      order: { id: 'DESC' } // เรียงจากใหม่ไปเก่า
    });
  }

  // ✅ เพิ่ม: หาเฉพาะสินค้าของ User คนนั้น
  findByUser(userId: number) {
    return this.productsRepository.find({
      where: { user: { id: userId } },
      order: { id: 'DESC' }
    });
  }

  findOne(id: number) {
    return this.productsRepository.findOne({ 
      where: { id },
      relations: ['user'] 
    });
  }

  async remove(id: number) {
    return this.productsRepository.delete(id);
  }

  async update(id: number, updateProductDto: any) {
    return this.productsRepository.update(id, updateProductDto);
  }
}