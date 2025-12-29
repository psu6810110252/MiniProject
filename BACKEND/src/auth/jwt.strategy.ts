import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // รับ Token จาก Header แบบ Bearer
      ignoreExpiration: false,
      secretOrKey: 'SECRET_KEY_NAJA', // *ต้องตรงกับที่ตั้งไว้ใน AuthModule เป๊ะๆ*
    });
  }

  async validate(payload: any) {
    // เมื่อแกะบัตรผ่าน จะส่งข้อมูลนี้ไปให้ Controller ใช้งาน (ผ่านตัวแปร req.user)
    // สำคัญ: ต้องส่ง key ชื่อ 'id' เพื่อให้ตรงกับ Database
    return { id: payload.sub, username: payload.username, role: payload.role };
  }
}