import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // <--- เพิ่ม
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity'; // <--- เพิ่ม

@Module({
  imports: [TypeOrmModule.forFeature([User])], // <--- บรรทัดนี้สำคัญมาก! บอกให้รู้จักตาราง User
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}