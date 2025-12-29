import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity'; // import User
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  // รับข้อมูลสินค้า (dto) และ ข้อมูลคนขาย (user)
  async create(createProductDto: any, user: any) { 
  const newProduct = this.productsRepository.create({
    ...createProductDto,
    user: user, 
  });
  return this.productsRepository.save(newProduct);
}

  findAll() {
    return this.productsRepository.find({ relations: ['user'] }); // ดึงข้อมูลคนขายมาโชว์ด้วย
  }

  findOne(id: number) {
    return this.productsRepository.findOne({ 
      where: { id },
      relations: ['user'] 
    });
  }
  // ... โค้ดเดิมข้างบน ...

// เพิ่มฟังก์ชันลบข้อมูลตาม ID
   async remove(id: number) {
    return this.productsRepository.delete(id);
    }

}