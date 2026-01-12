import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { OrderItem } from './order-item.entity'; // 👈 แก้ตรงนี้: ตัด /entities ออก

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'PENDING' })
  status: string;

  @Column({ nullable: true })
  slipImage: string;

  @Column('decimal', { precision: 10, scale: 2 })
  totalPrice: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, { eager: true })
  user: User;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  orderItems: OrderItem[]; // <--- ตรงนี้ชื่อ orderItems ครับ
  //
}