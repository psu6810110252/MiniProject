import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm'; // เพิ่ม DataSource
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem) private orderItemsRepository: Repository<OrderItem>,
    @InjectRepository(Product) private productsRepository: Repository<Product>,
    private dataSource: DataSource, // สำหรับทำ Transaction
  ) {}

  // ฟังก์ชันเดิมสำหรับการซื้อทีละชิ้น
  async create(userId: number, productId: number, slipImage?: string) {
    const product = await this.productsRepository.findOneBy({ id: productId });
    if (!product) throw new Error('สินค้าไม่ถูกต้อง');

    const order = new Order();
    order.user = { id: userId } as any;
    order.totalPrice = product.price;
    order.status = 'PENDING';
    if (slipImage) order.slipImage = slipImage;

    const orderItem = new OrderItem();
    orderItem.product = product;
    orderItem.price = product.price;
    orderItem.quantity = 1;
    orderItem.order = order;
    order.orderItems = [orderItem];

    const savedOrder = await this.ordersRepository.save(order);
    if (savedOrder.orderItems) {
      savedOrder.orderItems.forEach(item => { delete (item as any).order; });
    }
    return savedOrder;
  }

  // 🔥 เพิ่มฟังก์ชันสำหรับตะกร้าสินค้า (Bulk Order)
  async createBulk(userId: number, items: any[], slipImage?: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order = new Order();
      order.user = { id: userId } as any;
      order.status = 'PENDING';
      // คำนวณราคาทั้งตะกร้า
      order.totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      if (slipImage) order.slipImage = slipImage;

      const savedOrder = await queryRunner.manager.save(order);

      const orderItems = items.map(item => {
        const oi = new OrderItem();
        oi.product = { id: item.id } as any;
        oi.price = item.price;
        oi.quantity = item.quantity;
        oi.order = savedOrder;
        return oi;
      });

      await queryRunner.manager.save(OrderItem, orderItems);
      await queryRunner.commitTransaction();

      return savedOrder;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  // ฟังก์ชันอื่นๆ คงเดิม
  async findAllAdmin() {
    return this.ordersRepository.find({
      relations: ['user', 'orderItems', 'orderItems.product'],
      order: { createdAt: 'DESC' }
    });
  }

  async approve(id: number) {
    const order = await this.ordersRepository.findOneBy({ id });
    if (!order) throw new Error('ไม่พบออเดอร์');
    order.status = 'APPROVED';
    return this.ordersRepository.save(order);
  }

  findAll(userId: number) {
    return this.ordersRepository.find({
      where: { user: { id: userId } as any },
      relations: ['orderItems', 'orderItems.product'],
      order: { createdAt: 'DESC' }
    });
  }
}