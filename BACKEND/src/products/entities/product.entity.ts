import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  // เพิ่ม precision เพื่อให้เก็บทศนิยมได้เป๊ะขึ้น (เช่น 10 หลัก ทศนิยม 2 ตำแหน่ง)
  @Column('decimal', { precision: 10, scale: 2 }) 
  price: number;

  @Column({ nullable: true })
  image: string;

  @ManyToOne(() => User, (user) => user.id) // เชื่อมกลับไปหา User
  user: User;
}