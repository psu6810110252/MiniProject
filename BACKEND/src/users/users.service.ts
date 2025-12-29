import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt'; // ตัวช่วยเข้ารหัส

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async register(body: any) {
    // 1. รับรหัสผ่านมาก่อน แล้วเข้ารหัส (Hash)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(body.password, salt);

    // 2. สร้าง User Object ใหม่
    const newUser = this.usersRepository.create({
      username: body.username,
      password: hashedPassword, // เก็บตัวที่ Hash แล้วเท่านั้น!
      role: 'BUYER' // ค่าเริ่มต้นให้เป็นคนซื้อ
    });

    // 3. บันทึกลง Database
    return this.usersRepository.save(newUser);
  }

  // ฟังก์ชันดึง User ทั้งหมด (เอาไว้เทสดูว่าข้อมูลเข้าไหม)
  findAll() {
    return this.usersRepository.find();
  }
}