import { Controller, Get, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register') // เรียกผ่าน http://localhost:3000/users/register
  create(@Body() body: any) {
    return this.usersService.register(body);
  }

  @Get() // เรียกผ่าน http://localhost:3000/users (เอาไว้เช็คของ)
  findAll() {
    return this.usersService.findAll();
  }
}