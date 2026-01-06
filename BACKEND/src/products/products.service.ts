import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  // ✅ แก้ create: รับ user เข้ามาและบันทึก
  async create(createProductDto: any, user: User) {
    const newProduct = this.productsRepository.create({
      ...createProductDto,
      user: user, // 👈 สำคัญมาก! ต้องผูก User กับสินค้า
    });
    return this.productsRepository.save(newProduct);
  }

  findAll() {
    return this.productsRepository.find({ relations: ['user'] }); // load user ด้วย
  }

  findOne(id: number) {
    return this.productsRepository.findOne({ 
      where: { id },
      relations: ['user'] 
    });
  }

  // ✅ เพิ่มฟังก์ชันนี้: หาเฉพาะของ user คนนั้น
  async findByUser(userId: number) {
    return this.productsRepository.find({
      where: { user: { id: userId } }, // ค้นหาจาก userId ที่ผูกไว้
      order: { id: 'DESC' },
      relations: ['user']
    });
  }

  update(id: number, updateProductDto: any) {
    return this.productsRepository.update(id, updateProductDto);
  }

  remove(id: number) {
    return this.productsRepository.delete(id);
  }
}