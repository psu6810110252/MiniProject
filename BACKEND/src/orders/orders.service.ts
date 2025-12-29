import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem) private orderItemsRepository: Repository<OrderItem>,
    @InjectRepository(Product) private productsRepository: Repository<Product>,
  ) {}

  // 👇 แก้บรรทัดนี้: เพิ่ม slipImage? เป็นตัวรับค่าตัวที่ 3 (เครื่องหมาย ? แปลว่ามีหรือไม่มีก็ได้)
  async create(userId: number, productId: number, slipImage?: string) {
    // 1. เช็คราคาสินค้าล่าสุด
    const product = await this.productsRepository.findOneBy({ id: productId });
    if (!product) throw new Error('สินค้าไม่ถูกต้อง');

    // 2. สร้างหัวบิล (Order)
    const order = new Order();
    order.user = { id: userId } as any; // ระบุคนซื้อ
    order.totalPrice = product.price;   // ระบุยอดรวม
    order.status = 'PENDING';           // สถานะรอจ่ายเงิน

    // 👇 เพิ่มบรรทัดนี้: ถ้ามีชื่อไฟล์ส่งมา ให้บันทึกลง Database
    if (slipImage) {
      order.slipImage = slipImage;
    }

    // 3. สร้างรายการสินค้าในบิล (OrderItem)
    const orderItem = new OrderItem();
    orderItem.product = product;
    orderItem.price = product.price;    // บันทึกราคา ณ ตอนซื้อ
    orderItem.quantity = 1;             // สมมติว่าซื้อทีละ 1 ชิ้น
    orderItem.order = order;            // ผูกกับหัวบิล

    // 4. เอารายการยัดใส่หัวบิล
    order.orderItems = [orderItem];

    // 5. บันทึกลง Database
    const savedOrder = await this.ordersRepository.save(order);

    // แก้ Bug งูกินหาง (Circular Dependency)
    if (savedOrder.orderItems) {
      savedOrder.orderItems.forEach(item => {
        // 👇 แก้ตรงนี้: เติม (item as any) เพื่อบังคับลบ
        delete (item as any).order; 
      });
    }

    return savedOrder;
  }

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

  // ฟังก์ชันดูประวัติการสั่งซื้อของตัวเอง
  findAll(userId: number) {
    return this.ordersRepository.find({
      where: { user: { id: userId } },
      relations: ['orderItems', 'orderItems.product'], // ดึงข้อมูลสินค้ามาโชว์ด้วย
      order: { createdAt: 'DESC' } // เรียงจากใหม่ไปเก่า
    });
  }
}