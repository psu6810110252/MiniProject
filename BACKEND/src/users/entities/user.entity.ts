import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity() // บอกว่านี่คือตารางใน Database
export class User {
  @PrimaryGeneratedColumn() // id รันเลขอัตโนมัติ (1, 2, 3...)
  id: number;

  @Column({ unique: true }) // ชื่อห้ามซ้ำ
  username: string;

  @Column()
  password: string;

  @Column({ default: 'BUYER' }) // ถ้าไม่ระบุ ให้เป็น BUYER (คนซื้อ)
  role: string;
}