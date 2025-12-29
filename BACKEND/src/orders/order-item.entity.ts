import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Order } from './order.entity';
import { Product } from '../products/entities/product.entity'; // สินค้ายังอยู่ที่เดิม

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ default: 1 })
  quantity: number;

  @ManyToOne(() => Order, (order) => order.orderItems, { onDelete: 'CASCADE' })
  order: Order;

  @ManyToOne(() => Product)
  product: Product;
}