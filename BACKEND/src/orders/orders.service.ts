import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm'; 
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { Product } from '../products/entities/product.entity';
import { Payout } from './entities/payout.entity';

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

  // 🔥 ฟังก์ชันสำหรับตะกร้าสินค้า (Bulk Order)
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

  // ✅ ปรับปรุง: เพิ่ม Logic หัก 5% ในฟังก์ชัน approve
  async approve(id: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. ค้นหา Order พร้อมข้อมูลสินค้าและเจ้าของสินค้า (Seller)
      const order = await queryRunner.manager.findOne(Order, {
        where: { id },
        relations: ['orderItems', 'orderItems.product', 'orderItems.product.user'],
      });

      if (!order) throw new Error('ไม่พบออเดอร์');
      if (order.status === 'APPROVED') throw new Error('ออเดอร์นี้ถูกอนุมัติไปแล้ว');

      // 2. อัปเดตสถานะออเดอร์เป็น APPROVED
      order.status = 'APPROVED';
      await queryRunner.manager.save(order);

      // 3. 🚀 Logic สร้างข้อมูล Payout (หัก 5%)
      // วนลูปสร้างรายการยอดเงินโอนให้คนขาย ตามจำนวนสินค้าในออเดอร์
      for (const item of order.orderItems) {
        const payout = new Payout();
        
        // คำนวณราคารวมของ item นั้น (เผื่อ quantity > 1)
        const totalItemPrice = Number(item.price) * item.quantity;
        
        // คำนวณยอดที่จะหัก 5%
        const adminFee = totalItemPrice * 0.05;
        const sellerReceive = totalItemPrice - adminFee;

        payout.amount = sellerReceive; // ยอดเงินสุทธิที่คนขายจะได้รับ (95%)
        payout.seller = item.product.user; // ระบุคนขายที่จะได้รับเงิน
        payout.order = order;
        payout.status = 'PENDING'; // สถานะรอแอดมินโอนเงินจริงให้คนขาย
        
        await queryRunner.manager.save(payout);
      }

      await queryRunner.commitTransaction();
      return { message: 'อนุมัติออเดอร์และสร้างรายการรอยอดโอนให้ผู้ขายเรียบร้อย (หัก 5%)' };

    } catch (err) {
      // หากเกิดข้อผิดพลาด ให้ยกเลิกการเปลี่ยนแปลงทั้งหมด (Rollback)
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      // ปล่อยการเชื่อมต่อคืนระบบ
      await queryRunner.release();
    }
  }

  // 🔥 ฟังก์ชันสำหรับดึงข้อมูลรายได้ของผู้ขาย (Seller Dashboard)
  async getMyPayouts(sellerId: number) {
  return this.dataSource.getRepository(Payout).find({
    where: { seller: { id: sellerId } },
    relations: ['order'],
    order: { createdAt: 'DESC' }
  });
}

  findAll(userId: number) {
    return this.ordersRepository.find({
      where: { user: { id: userId } as any },
      relations: ['orderItems', 'orderItems.product'],
      order: { createdAt: 'DESC' }
    });
  }
}