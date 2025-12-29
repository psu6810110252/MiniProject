import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: 'SECRET_KEY_NAJA', // ของจริงควรเก็บใน .env แต่วันนี้เอาแบบนี้ไปก่อน
      signOptions: { expiresIn: '60m' }, // บัตรหมดอายุใน 60 นาที
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}